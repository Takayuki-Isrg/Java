-- =============================================
-- プロジェクト管理システム - テーブル作成スクリプト
-- SQL Server用
-- =============================================

USE [project_management_db]
GO

-- =============================================
-- 1. users テーブル
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[users] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [username] NVARCHAR(50) NOT NULL,
        [password] NVARCHAR(255) NOT NULL,
        [email] NVARCHAR(255) NOT NULL,
        [display_name] NVARCHAR(100) NOT NULL,
        [created_at] DATETIME2 NOT NULL,
        [updated_at] DATETIME2 NOT NULL,
        [is_enabled] BIT NOT NULL DEFAULT 1,
        [is_account_non_expired] BIT NOT NULL DEFAULT 1,
        [is_account_non_locked] BIT NOT NULL DEFAULT 1,
        [is_credentials_non_expired] BIT NOT NULL DEFAULT 1,
        CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_users_username] UNIQUE ([username]),
        CONSTRAINT [UQ_users_email] UNIQUE ([email])
    )
    PRINT 'users テーブルを作成しました。'
END
ELSE
BEGIN
    PRINT 'users テーブルは既に存在します。'
END
GO

-- =============================================
-- 2. projects テーブル
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[projects]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[projects] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
        [description] NTEXT NULL,
        [start_date] DATE NULL,
        [end_date] DATE NULL,
        [status] NVARCHAR(20) NOT NULL,
        [created_by] BIGINT NULL,
        [created_at] DATETIME2 NOT NULL,
        [updated_at] DATETIME2 NOT NULL,
        CONSTRAINT [PK_projects] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_projects_created_by] FOREIGN KEY ([created_by]) 
            REFERENCES [dbo].[users] ([id]) ON DELETE SET NULL
    )
    PRINT 'projects テーブルを作成しました。'
END
ELSE
BEGIN
    PRINT 'projects テーブルは既に存在します。'
END
GO

-- =============================================
-- 3. tasks テーブル
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tasks]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[tasks] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [project_id] BIGINT NOT NULL,
        [title] NVARCHAR(200) NOT NULL,
        [description] NTEXT NULL,
        [status] NVARCHAR(20) NOT NULL DEFAULT 'TODO',
        [priority] NVARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
        [assigned_user_id] BIGINT NULL,
        [created_by] BIGINT NULL,
        [deadline] DATE NULL,
        [created_at] DATETIME2 NOT NULL,
        [updated_at] DATETIME2 NOT NULL,
        CONSTRAINT [PK_tasks] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_tasks_project_id] FOREIGN KEY ([project_id]) 
            REFERENCES [dbo].[projects] ([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_tasks_assigned_user_id] FOREIGN KEY ([assigned_user_id]) 
            REFERENCES [dbo].[users] ([id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_tasks_created_by] FOREIGN KEY ([created_by]) 
            REFERENCES [dbo].[users] ([id]) ON DELETE NO ACTION
    )
    PRINT 'tasks テーブルを作成しました。'
END
ELSE
BEGIN
    PRINT 'tasks テーブルは既に存在します。'
END
GO

-- =============================================
-- 4. comments テーブル
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[comments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[comments] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [task_id] BIGINT NOT NULL,
        [user_id] BIGINT NOT NULL,
        [content] NTEXT NOT NULL,
        [created_at] DATETIME2 NOT NULL,
        [updated_at] DATETIME2 NOT NULL,
        CONSTRAINT [PK_comments] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_comments_task_id] FOREIGN KEY ([task_id]) 
            REFERENCES [dbo].[tasks] ([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_comments_user_id] FOREIGN KEY ([user_id]) 
            REFERENCES [dbo].[users] ([id]) ON DELETE NO ACTION
    )
    PRINT 'comments テーブルを作成しました。'
END
ELSE
BEGIN
    PRINT 'comments テーブルは既に存在します。'
END
GO

-- =============================================
-- 5. projects_members テーブル（中間テーブル）
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[projects_members]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[projects_members] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [project_id] BIGINT NOT NULL,
        [user_id] BIGINT NOT NULL,
        [role_in_project] NVARCHAR(20) NOT NULL DEFAULT 'MEMBER',
        [joined_at] DATETIME2 NOT NULL,
        CONSTRAINT [PK_projects_members] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_projects_members_project_id] FOREIGN KEY ([project_id]) 
            REFERENCES [dbo].[projects] ([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_projects_members_user_id] FOREIGN KEY ([user_id]) 
            REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE,
        CONSTRAINT [UQ_projects_members_project_user] UNIQUE ([project_id], [user_id])
    )
    PRINT 'projects_members テーブルを作成しました。'
END
ELSE
BEGIN
    PRINT 'projects_members テーブルは既に存在します。'
END
GO

-- =============================================
-- インデックスの作成（パフォーマンス向上のため）
-- =============================================

-- projects テーブルのインデックス
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_projects_created_by' AND object_id = OBJECT_ID('dbo.projects'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_projects_created_by] ON [dbo].[projects] ([created_by])
    PRINT 'projects.created_by にインデックスを作成しました。'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_projects_status' AND object_id = OBJECT_ID('dbo.projects'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_projects_status] ON [dbo].[projects] ([status])
    PRINT 'projects.status にインデックスを作成しました。'
END
GO

-- tasks テーブルのインデックス
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_tasks_project_id' AND object_id = OBJECT_ID('dbo.tasks'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_tasks_project_id] ON [dbo].[tasks] ([project_id])
    PRINT 'tasks.project_id にインデックスを作成しました。'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_tasks_assigned_user_id' AND object_id = OBJECT_ID('dbo.tasks'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_tasks_assigned_user_id] ON [dbo].[tasks] ([assigned_user_id])
    PRINT 'tasks.assigned_user_id にインデックスを作成しました。'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_tasks_status' AND object_id = OBJECT_ID('dbo.tasks'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_tasks_status] ON [dbo].[tasks] ([status])
    PRINT 'tasks.status にインデックスを作成しました。'
END
GO

-- comments テーブルのインデックス
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_comments_task_id' AND object_id = OBJECT_ID('dbo.comments'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_comments_task_id] ON [dbo].[comments] ([task_id])
    PRINT 'comments.task_id にインデックスを作成しました。'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_comments_user_id' AND object_id = OBJECT_ID('dbo.comments'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_comments_user_id] ON [dbo].[comments] ([user_id])
    PRINT 'comments.user_id にインデックスを作成しました。'
END
GO

-- projects_members テーブルのインデックス
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_projects_members_project_id' AND object_id = OBJECT_ID('dbo.projects_members'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_projects_members_project_id] ON [dbo].[projects_members] ([project_id])
    PRINT 'projects_members.project_id にインデックスを作成しました。'
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_projects_members_user_id' AND object_id = OBJECT_ID('dbo.projects_members'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_projects_members_user_id] ON [dbo].[projects_members] ([user_id])
    PRINT 'projects_members.user_id にインデックスを作成しました。'
END
GO

PRINT '============================================='
PRINT '全てのテーブルとインデックスの作成が完了しました。'
PRINT '============================================='

