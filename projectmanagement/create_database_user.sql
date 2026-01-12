-- =============================================
-- プロジェクト管理システム - データベースユーザー作成スクリプト
-- SQL Server用
-- =============================================

USE [master]
GO

-- =============================================
-- 1. SQL Server 認証でログインを作成
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'project_user')
BEGIN
    CREATE LOGIN [project_user] WITH PASSWORD = 'ProjectPass123!', 
        DEFAULT_DATABASE = [project_management_db],
        CHECK_EXPIRATION = OFF,
        CHECK_POLICY = OFF;
    PRINT 'ログイン project_user を作成しました。'
END
ELSE
BEGIN
    PRINT 'ログイン project_user は既に存在します。'
END
GO

-- =============================================
-- 2. データベースユーザーを作成
-- =============================================
USE [project_management_db]
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'project_user')
BEGIN
    CREATE USER [project_user] FOR LOGIN [project_user];
    PRINT 'データベースユーザー project_user を作成しました。'
END
ELSE
BEGIN
    PRINT 'データベースユーザー project_user は既に存在します。'
END
GO

-- =============================================
-- 3. 必要な権限を付与
-- =============================================
-- db_datareader: データの読み取り権限
-- db_datawriter: データの書き込み権限
-- db_ddladmin: DDL操作（テーブル作成など）の権限
-- db_securityadmin: セキュリティ設定の権限（インデックス作成などに必要）

ALTER ROLE [db_datareader] ADD MEMBER [project_user];
ALTER ROLE [db_datawriter] ADD MEMBER [project_user];
ALTER ROLE [db_ddladmin] ADD MEMBER [project_user];
GO

PRINT 'project_user に必要な権限を付与しました。'
GO

-- =============================================
-- 4. 確認
-- =============================================
SELECT 
    dp.name AS [User],
    dp.type_desc AS [Type],
    rp.name AS [Role]
FROM sys.database_role_members drm
JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
WHERE dp.name = 'project_user'
GO

PRINT '============================================='
PRINT 'データベースユーザー project_user の作成が完了しました。'
PRINT 'ユーザー名: project_user'
PRINT 'パスワード: ProjectPass123!'
PRINT '============================================='

