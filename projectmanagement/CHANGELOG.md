# 変更履歴 (Changelog)

このファイルには、プロジェクトの主要な変更内容を記録しています。

---

## [バージョン 0.0.1-SNAPSHOT] - 2025-10-13

### 🎉 初回リリース - 基本機能実装

#### ✅ 追加 (Added)

##### プロジェクト構成
- Mavenプロジェクトの初期設定 (`pom.xml`)
- Spring Boot 3.1.0 / Java 21ベースのプロジェクト構造
- 開発環境（H2）と本番環境（SQL Server）の構成ファイル

##### エンティティ層
- **User.java** - ユーザーエンティティの作成
  - Spring SecurityのUserDetailsインターフェース実装
  - Bean Validationによる入力検証（日本語メッセージ）
  - 自動的な作成日時・更新日時の設定

##### リポジトリ層
- **UserRepository.java** - ユーザーデータアクセス層
  - ユーザー名による検索
  - メールアドレスによる検索
  - 重複チェック機能

##### サービス層
- **UserService.java** - ユーザービジネスロジック
  - Spring Security統合（UserDetailsService実装）
  - ユーザー作成（重複チェック、パスワード暗号化）
  - CRUD操作の実装
  - トランザクション管理

##### コントローラ層
- **UserController.java** - ユーザー画面コントローラ
  - ログイン画面の表示
  - 登録画面の表示（UI未実装）

- **DashboardController.java** - ダッシュボードコントローラ
  - 認証済みユーザー情報の取得
  - 統計情報の準備（枠組み）

- **ProjectController.java** - プロジェクトコントローラ（空）
- **TaskController.java** - タスクコントローラ（空）
- **CommentController.java** - コメントコントローラ（空）

##### 設定クラス
- **SecurityConfig.java** - Spring Security設定
  - フォームベース認証の設定
  - エンドポイント別のアクセス制御
  - BCryptパスワードエンコーダーの設定
  - CSRF保護の有効化

- **DataInitializer.java** - 初期データ作成
  - 管理者ユーザー（admin）の自動作成
  - テストユーザー2名（user1, user2）の自動作成

##### ビュー（テンプレート）
- **login.html** - ログイン画面
  - Bootstrap 5による美しいUI
  - エラーメッセージ表示機能
  - ログアウト成功メッセージ表示
  - CSRF対応

- **dashboard.html** - ダッシュボード画面
  - レスポンシブナビゲーションバー
  - ウェルカムメッセージ
  - 4つの統計カード（プロジェクト、タスク、進行中、完了）
  - クイックアクションボタン
  - 最近のアクティビティセクション（枠組み）
  - 今日の予定セクション（枠組み）

##### スタイルシート
- **style.projectmanagement.css** - 共通スタイル
- **style.dashboard.css** - ダッシュボード専用スタイル

##### 設定ファイル
- **application.properties** - 開発環境設定
  - H2インメモリデータベース設定
  - JPA設定（create-drop）
  - H2コンソールの有効化
  - デバッグレベルのログ設定

- **application-prod.properties** - 本番環境設定
  - SQL Server接続設定
  - JPA設定（update）
  - 本番用ログレベル
  - セッション管理設定

##### ドキュメント
- **ERD.md** - エンティティ関係図（Mermaid形式）
  - User, Project, Task, Comment, ProjectMemberの関係定義
  
- **ScreenTransition.md** - 画面遷移図
  - 主要画面間の遷移フロー
  
- **WFD_logintodashboard.md** - ワークフロー図
  - ログインからダッシュボードまでの詳細フロー
  
- **README.md** - プロジェクト概要ドキュメント
  - プロジェクト全体の説明
  - セットアップ方法
  - 技術仕様

#### 🔧 技術的な実装詳細

##### セキュリティ
- Spring Securityによる認証・認可の実装
- BCryptによるパスワードハッシュ化（強度10）
- CSRF保護の有効化
- セッションベースの認証
- HTTPOnlyクッキーの使用

##### データベース
- JPA/Hibernate ORM使用
- 開発環境: H2インメモリDB（起動時にスキーマ自動作成）
- 本番環境: SQL Server対応
- 自動的なタイムスタンプ（@PrePersist, @PreUpdate）

##### バリデーション
- Bean Validationによる入力検証
- カスタム日本語エラーメッセージ
- ユーザー名: 3-50文字、ユニーク制約
- パスワード: 6文字以上
- メールアドレス: 形式チェック、ユニーク制約

##### UI/UX
- Bootstrap 5による最新のデザインシステム
- Bootstrap Iconsによる視覚的なアイコン
- レスポンシブデザイン（モバイル対応）
- 統一されたカラーパレット
- 使いやすいナビゲーション

#### 📦 依存関係

**主要な依存ライブラリ:**
- spring-boot-starter-web (3.1.0)
- spring-boot-starter-security (3.1.0)
- spring-boot-starter-data-jpa (3.1.0)
- spring-boot-starter-thymeleaf (3.1.0)
- spring-boot-starter-validation (3.1.0)
- h2database (runtime)
- mssql-jdbc (runtime)

**フロントエンド:**
- Bootstrap 5.3.0 (CDN)
- Bootstrap Icons 1.10.0 (CDN)

---

## [未リリース] - 今後の予定

### ⏳ 計画中 (Planned)

#### プロジェクト管理機能
- [ ] Projectエンティティの作成
- [ ] ProjectRepositoryの実装
- [ ] ProjectServiceの実装
- [ ] ProjectControllerの実装
- [ ] プロジェクト一覧画面
- [ ] プロジェクト詳細画面
- [ ] プロジェクト作成・編集・削除機能

#### タスク管理機能
- [ ] Taskエンティティの作成
- [ ] TaskRepositoryの実装
- [ ] TaskServiceの実装
- [ ] TaskControllerの実装
- [ ] タスク一覧画面
- [ ] タスク詳細画面
- [ ] タスクステータス管理（TODO/進行中/完了）
- [ ] タスク優先度管理（高/中/低）
- [ ] 期限管理

#### コメント機能
- [ ] Commentエンティティの作成
- [ ] CommentRepositoryの実装
- [ ] CommentServiceの実装
- [ ] CommentControllerの実装
- [ ] タスクへのコメント追加・編集・削除

#### プロジェクトメンバー管理
- [ ] ProjectMemberエンティティの作成
- [ ] プロジェクトへのメンバー追加・削除
- [ ] プロジェクト内でのロール管理

#### ユーザー機能拡張
- [ ] ユーザー登録画面の実装
- [ ] パスワードリセット機能
- [ ] プロフィール編集機能
- [ ] アバター画像アップロード

#### 統計・レポート機能
- [ ] 実際の統計データの計算
- [ ] プロジェクト進捗率の表示
- [ ] タスク完了率の表示
- [ ] ユーザー別作業量の表示
- [ ] チャート・グラフの追加

#### 検索・フィルタリング
- [ ] プロジェクト検索機能
- [ ] タスク検索機能
- [ ] 高度なフィルタリング（ステータス、優先度、期限など）
- [ ] ソート機能

#### 通知機能
- [ ] タスク割り当て通知
- [ ] 期限接近通知
- [ ] コメント通知

#### セキュリティ強化
- [ ] ロールベースアクセス制御（ROLE_ADMIN, ROLE_USER）
- [ ] アカウントロック機能
- [ ] ログイン試行回数制限
- [ ] パスワードポリシーの強化

#### テスト
- [ ] ユニットテストの作成
- [ ] 統合テストの作成
- [ ] E2Eテストの作成

#### パフォーマンス改善
- [ ] データベースインデックスの最適化
- [ ] キャッシング戦略の実装
- [ ] ページネーション機能
- [ ] 遅延読み込み

#### デプロイメント
- [ ] Docker化
- [ ] CI/CDパイプラインの構築
- [ ] 本番環境へのデプロイ手順書

---

## 🐛 既知の問題 (Known Issues)

現在、重大な既知の問題はありません。

---

## 📝 メモ

### 開発環境
- OS: Windows 10
- IDE: IntelliJ IDEA / VSCode
- Java: OpenJDK 21
- Maven: 3.9.x

### ブランチ戦略
- `main` - 本番環境用の安定版
- `develop` - 開発環境用（現在作業中）
- `feature/*` - 新機能開発用

### コミット規約
```
[種類] 簡潔な説明

詳細な説明（オプション）

種類:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント更新
- style: コードフォーマット
- refactor: リファクタリング
- test: テスト追加・修正
- chore: ビルド処理やツールの変更
```

---

**変更履歴の形式について**

このファイルは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) の形式に基づいています。
バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) に従います。

**最終更新**: 2025年10月13日

