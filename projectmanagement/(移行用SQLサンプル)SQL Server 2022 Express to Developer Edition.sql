-- =====================================================
-- SQL Server 2022 Express to Developer Edition
-- 移行チェックリスト＆スクリプト集
-- =====================================================

-- =====================================================
-- 1. ログインとユーザー権限の確認・スクリプト化
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ ログイン一覧の確認
EXEC sp_helplogins;

-- ■ データベースユーザーとロールの確認
USE [project_management_db];
EXEC sp_helpuser;

-- ■ ログインのスクリプト生成（SQL認証の場合）
-- 注意: パスワードハッシュを含むため、結果をコピーして移行先で実行
SELECT 
    'CREATE LOGIN [' + sp.name + '] WITH PASSWORD = ' + 
    CONVERT(VARCHAR(256), LOGINPROPERTY(sp.name, 'PasswordHash'), 1) + 
    ' HASHED, SID = ' + CONVERT(VARCHAR(85), sp.sid, 1) + 
    ', DEFAULT_DATABASE = [' + sp.default_database_name + ']' +
    ', CHECK_POLICY = ' + CASE WHEN sp.is_policy_checked = 1 THEN 'ON' ELSE 'OFF' END +
    ', CHECK_EXPIRATION = ' + CASE WHEN sp.is_expiration_checked = 1 THEN 'ON' ELSE 'OFF' END + ';'
FROM sys.server_principals sp
LEFT JOIN sys.sql_logins sl ON sp.principal_id = sl.principal_id
WHERE sp.type = 'S' 
  AND sp.name NOT LIKE '##%'
  AND sp.name NOT IN ('sa', 'guest');

-- ■ Windows認証ログインのスクリプト生成
SELECT 
    'CREATE LOGIN [' + name + '] FROM WINDOWS WITH DEFAULT_DATABASE = [' + 
    default_database_name + '];'
FROM sys.server_principals
WHERE type IN ('U', 'G')
  AND name NOT LIKE 'NT %'
  AND name NOT LIKE '##%';

-- ■ データベースユーザーとロールのスクリプト生成
USE [project_management_db];
GO

SELECT 
    'CREATE USER [' + dp.name + '] FOR LOGIN [' + sp.name + '];'
FROM sys.database_principals dp
INNER JOIN sys.server_principals sp ON dp.sid = sp.sid
WHERE dp.type IN ('S', 'U', 'G')
  AND dp.name NOT IN ('dbo', 'guest', 'INFORMATION_SCHEMA', 'sys');

-- ■ データベースロールメンバーシップのスクリプト生成
SELECT 
    'EXEC sp_addrolemember @rolename = ''' + r.name + 
    ''', @membername = ''' + m.name + ''';'
FROM sys.database_role_members rm
INNER JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
INNER JOIN sys.database_principals m ON rm.member_principal_id = m.principal_id
WHERE m.name NOT IN ('dbo', 'guest');

-- ■ オブジェクトレベル権限のスクリプト生成
SELECT 
    CASE dp.state 
        WHEN 'G' THEN 'GRANT' 
        WHEN 'D' THEN 'DENY' 
        WHEN 'R' THEN 'REVOKE' 
    END + ' ' + dp.permission_name + 
    ' ON ' + SCHEMA_NAME(o.schema_id) + '.' + o.name +
    ' TO [' + usr.name + '];'
FROM sys.database_permissions dp
INNER JOIN sys.objects o ON dp.major_id = o.object_id
INNER JOIN sys.database_principals usr ON dp.grantee_principal_id = usr.principal_id
WHERE usr.name NOT IN ('public', 'dbo', 'guest');


-- =====================================================
-- 2. データベースオブジェクトの確認
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ テーブル一覧
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS TableName,
    create_date,
    modify_date
FROM sys.tables
ORDER BY SchemaName, TableName;

-- ■ ストアドプロシージャ一覧
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS ProcedureName,
    create_date,
    modify_date
FROM sys.procedures
ORDER BY SchemaName, ProcedureName;

-- ■ ビュー一覧
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS ViewName,
    create_date,
    modify_date
FROM sys.views
WHERE name NOT LIKE 'sys%'
ORDER BY SchemaName, ViewName;

-- ■ 関数一覧
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS FunctionName,
    type_desc AS FunctionType,
    create_date,
    modify_date
FROM sys.objects
WHERE type IN ('FN', 'IF', 'TF', 'FS', 'FT')
ORDER BY SchemaName, FunctionName;

-- ■ トリガー一覧
SELECT 
    OBJECT_NAME(parent_id) AS TableName,
    name AS TriggerName,
    is_disabled,
    create_date,
    modify_date
FROM sys.triggers
WHERE parent_class = 1
ORDER BY TableName, TriggerName;

-- ■ インデックス一覧
SELECT 
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique,
    i.is_primary_key
FROM sys.indexes i
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE i.name IS NOT NULL
ORDER BY SchemaName, TableName, IndexName;

-- ■ 制約一覧
SELECT 
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    c.name AS ConstraintName,
    c.type_desc AS ConstraintType
FROM sys.check_constraints c
INNER JOIN sys.tables t ON c.parent_object_id = t.object_id
UNION ALL
SELECT 
    SCHEMA_NAME(t.schema_id),
    t.name,
    d.name,
    'DEFAULT'
FROM sys.default_constraints d
INNER JOIN sys.tables t ON d.parent_object_id = t.object_id
ORDER BY SchemaName, TableName, ConstraintName;

-- ■ シーケンス一覧
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS SequenceName,
    CAST(start_value AS BIGINT) AS StartValue,
    CAST(increment AS BIGINT) AS Increment,
    CAST(current_value AS BIGINT) AS CurrentValue
FROM sys.sequences
ORDER BY SchemaName, SequenceName;


-- =====================================================
-- 3. SQL Server Agentジョブの確認
-- =====================================================

-- 【移行元サーバーで実行】
-- 注意: ExpressエディションにはSQL Server Agentがないため、
-- 移行元がExpressの場合はこのセクションはスキップ

-- ■ ジョブ一覧（Developer Editionで実行する場合）
SELECT 
    j.name AS JobName,
    j.description,
    j.enabled AS IsEnabled,
    j.date_created,
    j.date_modified
FROM msdb.dbo.sysjobs j
WHERE j.name NOT LIKE 'syspolicy%'
ORDER BY j.name;

-- ■ ジョブスクリプトの生成
-- SSMSの「SQL Server エージェント」→「ジョブ」から右クリック→「ジョブをスクリプト化」


-- =====================================================
-- 4. リンクサーバーの確認
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ リンクサーバー一覧
SELECT 
    name AS LinkedServerName,
    product,
    provider,
    data_source,
    is_remote_login_enabled
FROM sys.servers
WHERE is_linked = 1;

-- ■ リンクサーバーのスクリプト生成
SELECT 
    'EXEC sp_addlinkedserver @server = ''' + name + 
    ''', @provider = ''' + provider + 
    ''', @datasrc = ''' + ISNULL(data_source, '') + ''';'
FROM sys.servers
WHERE is_linked = 1;


-- =====================================================
-- 5. ファイルパスの確認と修正
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ 現在のデータベースファイルパス確認
USE [project_management_db];
SELECT 
    name AS LogicalName,
    physical_name AS PhysicalPath,
    size * 8 / 1024 AS SizeMB,
    type_desc AS FileType
FROM sys.database_files;

-- 【移行先サーバーで実行】

-- ■ Developer Editionのデフォルトデータディレクトリ確認
EXEC xp_instance_regread 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer',
    N'DefaultData';

EXEC xp_instance_regread 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer',
    N'DefaultLog';

-- ■ データベース作成スクリプト（ファイルパス修正版）
-- 注意: 以下のパスを実際のDeveloper Editionの環境に合わせて修正してください

USE [master]
GO

CREATE DATABASE [project_management_db]
 CONTAINMENT = NONE
 ON PRIMARY 
( NAME = N'project_management_db', 
  FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\project_management_db.mdf', 
  SIZE = 8192KB, 
  MAXSIZE = UNLIMITED, 
  FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'project_management_db_log', 
  FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\project_management_db_log.ldf', 
  SIZE = 8192KB, 
  MAXSIZE = 2048GB, 
  FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO


-- =====================================================
-- 6. 互換性レベルの確認
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ データベース互換性レベルの確認
SELECT 
    name AS DatabaseName,
    compatibility_level,
    CASE compatibility_level
        WHEN 160 THEN 'SQL Server 2022'
        WHEN 150 THEN 'SQL Server 2019'
        WHEN 140 THEN 'SQL Server 2017'
        WHEN 130 THEN 'SQL Server 2016'
        WHEN 120 THEN 'SQL Server 2014'
    END AS CompatibilityVersion
FROM sys.databases 
WHERE name = 'project_management_db';

-- 【移行先サーバーで実行】

-- ■ 互換性レベルの設定（必要に応じて）
ALTER DATABASE [project_management_db] SET COMPATIBILITY_LEVEL = 160;
GO


-- =====================================================
-- 7. 照合順序の確認
-- =====================================================

-- 【移行元サーバーで実行】

-- ■ インスタンスレベルの照合順序
SELECT SERVERPROPERTY('Collation') AS ServerCollation;

-- ■ データベースレベルの照合順序
SELECT 
    name AS DatabaseName,
    collation_name AS DatabaseCollation
FROM sys.databases
WHERE name = 'project_management_db';

-- ■ テーブル列の照合順序
SELECT 
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    c.name AS ColumnName,
    c.collation_name AS ColumnCollation
FROM sys.columns c
INNER JOIN sys.tables t ON c.object_id = t.object_id
WHERE c.collation_name IS NOT NULL
ORDER BY SchemaName, TableName, ColumnName;


-- =====================================================
-- 移行手順まとめ
-- =====================================================

/*
【方法A: .bakファイルを使った移行（推奨）】

1. 移行元サーバーでバックアップ作成:
   BACKUP DATABASE [project_management_db] 
   TO DISK = 'C:\Backup\project_management_db.bak'
   WITH COMPRESSION, CHECKSUM;

2. .bakファイルを移行先サーバーにコピー

3. 移行先サーバーでリストア:
   RESTORE DATABASE [project_management_db] 
   FROM DISK = 'C:\Backup\project_management_db.bak'
   WITH MOVE 'project_management_db' 
        TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\project_management_db.mdf',
        MOVE 'project_management_db_log' 
        TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\project_management_db_log.ldf',
        REPLACE;

4. セクション1のログイン・ユーザー・権限スクリプトを実行

5. リンクサーバー、SQL Server Agentジョブを再作成（該当する場合）


【方法B: スクリプトを使った移行】

1. SSMSで「タスク」→「スクリプトの生成」を選択
   - スクリプトオプションで以下を選択:
     ✓ テーブル
     ✓ インデックス
     ✓ キー（主キー、外部キー）
     ✓ トリガー
     ✓ ストアドプロシージャ
     ✓ ビュー
     ✓ 関数
     ✓ データ（オプション）

2. 生成されたスクリプトを移行先で実行

3. セクション1のログイン・ユーザー・権限スクリプトを実行

4. データをBCP、SSIS、またはINSERTスクリプトで移行


【移行後の確認】

-- オブジェクト数の確認
SELECT 
    'Tables' AS ObjectType, COUNT(*) AS Count FROM sys.tables
UNION ALL
SELECT 'Procedures', COUNT(*) FROM sys.procedures
UNION ALL
SELECT 'Views', COUNT(*) FROM sys.views WHERE name NOT LIKE 'sys%'
UNION ALL
SELECT 'Functions', COUNT(*) FROM sys.objects WHERE type IN ('FN', 'IF', 'TF')
UNION ALL
SELECT 'Triggers', COUNT(*) FROM sys.triggers WHERE parent_class = 1;

-- データ行数の確認
SELECT 
    SCHEMA_NAME(t.schema_id) AS SchemaName,
    t.name AS TableName,
    SUM(p.rows) AS RowCount
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0, 1)
GROUP BY SCHEMA_NAME(t.schema_id), t.name
ORDER BY SchemaName, TableName;
*/