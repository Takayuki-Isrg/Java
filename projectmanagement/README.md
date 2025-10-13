# プロジェクト管理システム (Project Management System)

## 📋 概要

Spring Boot 3.1.0とJava 21を使用した、モダンなプロジェクト管理システムです。  
チーム開発におけるプロジェクト、タスク、ユーザーの効率的な管理を目的としています。

### 技術スタック

- **バックエンド**: Spring Boot 3.1.0 / Java 21
- **セキュリティ**: Spring Security
- **データベース**: H2 (開発) / SQL Server (本番)
- **ORM**: Spring Data JPA / Hibernate
- **テンプレートエンジン**: Thymeleaf
- **フロントエンド**: Bootstrap 5 + Bootstrap Icons
- **ビルドツール**: Maven

---

## 🏗️ プロジェクト構成

```
projectmanagement/
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── config/              # 設定クラス
│   │   │   │   ├── SecurityConfig.java      # Spring Security設定
│   │   │   │   └── DataInitializer.java     # 初期データ作成
│   │   │   ├── controller/          # コントローラ層
│   │   │   │   ├── UserController.java      # ユーザー関連
│   │   │   │   ├── DashboardController.java # ダッシュボード
│   │   │   │   ├── ProjectController.java   # プロジェクト（未実装）
│   │   │   │   ├── TaskController.java      # タスク（未実装）
│   │   │   │   └── CommentController.java   # コメント（未実装）
│   │   │   ├── entity/              # エンティティ層
│   │   │   │   └── User.java                # ユーザーエンティティ
│   │   │   ├── repository/          # リポジトリ層
│   │   │   │   └── UserRepository.java      # ユーザーデータアクセス
│   │   │   ├── service/             # サービス層
│   │   │   │   └── UserService.java         # ユーザービジネスロジック
│   │   │   ├── dto/                 # データ転送オブジェクト（予定）
│   │   │   ├── form/                # フォームクラス（予定）
│   │   │   ├── exception/           # 例外クラス（予定）
│   │   │   ├── model/               # モデルクラス（予定）
│   │   │   └── util/                # ユーティリティ（予定）
│   │   └── resources/
│   │       ├── application.properties       # 開発環境設定
│   │       ├── application-prod.properties  # 本番環境設定
│   │       ├── static/
│   │       │   └── css/
│   │       │       ├── style.projectmanagement.css
│   │       │       └── style.dashboard.css
│   │       └── templates/
│   │           ├── user/
│   │           │   └── login.html           # ログイン画面
│   │           └── dashboard.html           # ダッシュボード画面
│   └── test/                        # テストコード（今後実装）
├── pom.xml                          # Maven設定
├── ERD.md                           # データベース設計書
├── ScreenTransition.md              # 画面遷移図
└── WFD_logintodashboard.md          # ワークフロー図
```

---

## 📚 主要コンポーネント詳細

### 1. エンティティ層

#### `User.java` (201行)
ユーザー情報を管理するJPAエンティティ。Spring SecurityのUserDetailsインターフェースを実装。

**主な属性:**
- `id` (Long) - 主キー、自動生成
- `username` (String) - ユーザー名（3-50文字、ユニーク、必須）
- `password` (String) - パスワード（6文字以上、BCrypt暗号化、必須）
- `email` (String) - メールアドレス（ユニーク、必須）
- `displayName` (String) - 表示名（最大100文字、必須）
- `createdAt` (LocalDateTime) - 作成日時
- `updatedAt` (LocalDateTime) - 更新日時
- `enabled` (Boolean) - アカウント有効フラグ
- `accountNonExpired` (Boolean) - アカウント期限切れフラグ
- `accountNonLocked` (Boolean) - アカウントロックフラグ
- `credentialsNonExpired` (Boolean) - 認証情報期限切れフラグ

**機能:**
- Bean Validationによる入力チェック（日本語エラーメッセージ）
- `@PrePersist` / `@PreUpdate`による日時自動設定
- Spring Security連携用メソッド実装

---

### 2. リポジトリ層

#### `UserRepository.java` (48行)
JpaRepositoryを継承したユーザーデータアクセスインターフェース。

**主なメソッド:**
```java
Optional<User> findByUsername(String username);
Optional<User> findByEmail(String email);
Optional<User> findByUsernameOrEmail(String username, String email);
boolean existsByUsername(String username);
boolean existsByEmail(String email);
```

---

### 3. サービス層

#### `UserService.java` (150行)
ユーザー管理のビジネスロジックを担当。UserDetailsServiceを実装。

**主な機能:**
- **認証**: `loadUserByUsername()` - Spring Security用ユーザー検索
- **作成**: `createUser()` - 重複チェック、パスワード暗号化
- **検索**: `findByUsername()`, `findByEmail()`, `findById()`
- **更新**: `updateUser()` - ユーザー情報更新
- **削除**: `deleteUser()` - ユーザー削除
- **検証**: `existsByUsername()`, `existsByEmail()` - 存在チェック

**トランザクション管理:**
- 書き込み操作: `@Transactional`
- 読み取り操作: `@Transactional(readOnly = true)`

---

### 4. コントローラ層

#### `UserController.java` (19行)
ユーザー関連の画面表示を担当。

**エンドポイント:**
- `GET /login` - ログイン画面表示
- `GET /register` - 登録画面表示（今後実装）

#### `DashboardController.java` (41行)
ダッシュボード画面の表示と統計情報の提供。

**エンドポイント:**
- `GET /dashboard` - ダッシュボード表示

**機能:**
- 認証されたユーザー情報の取得
- 統計情報の準備（現在は仮データ）
  - 総プロジェクト数
  - 総タスク数
  - 完了タスク数
  - 進行中タスク数

#### その他のコントローラ（未実装）
- `ProjectController.java` - プロジェクト管理（今後実装）
- `TaskController.java` - タスク管理（今後実装）
- `CommentController.java` - コメント機能（今後実装）

---

### 5. 設定クラス

#### `SecurityConfig.java` (39行)
Spring Securityの設定を管理。

**セキュリティルール:**
- **認証不要**: `/login`, `/register`, `/css/**`, `/js/**`
- **認証必須**: その他すべてのエンドポイント

**認証設定:**
- フォームログイン有効
- ログインURL: `/login`
- 成功時リダイレクト: `/dashboard`
- 失敗時リダイレクト: `/login?error`
- ログアウト成功時: `/login?logout`

**パスワード暗号化:**
- BCryptPasswordEncoderを使用

#### `DataInitializer.java` (49行)
アプリケーション起動時に初期データを作成。CommandLineRunnerを実装。

**作成される初期ユーザー:**
| ユーザー名 | パスワード | メール | 表示名 |
|---------|---------|-------|--------|
| admin | admin123 | admin@example.com | 管理者 |
| user1 | user123 | user1@example.com | ユーザー1 |
| user2 | user123 | user2@example.com | ユーザー2 |

---

### 6. 設定ファイル

#### `application.properties` (開発環境)
```properties
# プロファイル: dev
# データベース: H2インメモリ
# JPA: create-drop（起動時にスキーマ作成、終了時に削除）
# H2コンソール: 有効 (/h2-console)
# ログ: DEBUG（開発用詳細ログ）
```

#### `application-prod.properties` (本番環境)
```properties
# プロファイル: prod
# データベース: SQL Server (localhost:1433)
# JPA: update（既存スキーマ更新）
# ログ: WARN（本番用最小ログ）
# セキュリティ: セッションタイムアウト30分
```

---

### 7. ビュー（Thymeleaf テンプレート）

#### `login.html` (62行)
モダンなログイン画面。

**機能:**
- ユーザー名・パスワード入力
- 自動ログインチェックボックス
- エラーメッセージ表示（認証失敗時）
- ログアウト成功メッセージ表示
- パスワードリセットリンク
- CSRF保護機能付き

**デザイン:**
- Bootstrap 5使用
- レスポンシブデザイン
- Bootstrap Iconsでアイコン表示

#### `dashboard.html` (207行)
美しく機能的なダッシュボード画面。

**構成要素:**
1. **ナビゲーションバー**
   - プロジェクト管理リンク
   - タスク管理リンク
   - ユーザードロップダウン（プロフィール、設定、ログアウト）

2. **ウェルカムメッセージ**
   - ユーザー名表示
   - 挨拶メッセージ

3. **統計カード（4つ）**
   - プロジェクト数（青）
   - 総タスク数（緑）
   - 進行中タスク（黄）
   - 完了タスク（水色）

4. **クイックアクション**
   - 新しいプロジェクト作成
   - 新しいタスク作成
   - プロジェクト一覧表示
   - タスク一覧表示

5. **最近のアクティビティ**（今後実装予定）

6. **今日の予定**（今後実装予定）

---

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: Bootstrap Primary（青）
- **成功**: Bootstrap Success（緑）
- **警告**: Bootstrap Warning（黄）
- **情報**: Bootstrap Info（水色）
- **危険**: Bootstrap Danger（赤）

### アイコン
Bootstrap Icons 1.10.0を使用

### レイアウト
- レスポンシブグリッドシステム
- モバイルファーストデザイン

---

## 🗄️ データベース設計

詳細は `ERD.md` を参照。

### エンティティ関係（計画）

```
USER ←→ PROJECT_MEMBER ←→ PROJECT
  ↓                           ↓
TASK ←→ COMMENT              TASK
```

### 実装済みテーブル
- **users** - ユーザー情報

### 今後実装予定のテーブル
- **projects** - プロジェクト情報
- **project_members** - プロジェクトメンバー
- **tasks** - タスク情報
- **comments** - コメント情報

---

## 🔒 セキュリティ機能

### 実装済み
✅ Spring Securityによる認証・認可  
✅ BCryptによるパスワード暗号化  
✅ CSRF保護  
✅ セッション管理  
✅ HTTPOnlyクッキー  

### 今後実装予定
⏳ ロール・権限管理（ROLE_USER, ROLE_ADMIN）  
⏳ パスワードリセット機能  
⏳ アカウントロック機能  
⏳ ログイン試行回数制限  

---

## ✅ 実装状況

### 完了済み機能

#### ユーザー認証・認可
- [x] ログイン画面
- [x] ログアウト機能
- [x] セッション管理
- [x] パスワード暗号化
- [x] CSRF保護

#### ユーザー管理
- [x] Userエンティティ
- [x] UserRepository
- [x] UserService
- [x] 入力バリデーション
- [x] 初期データ作成

#### ダッシュボード
- [x] ダッシュボード画面
- [x] ユーザー情報表示
- [x] ナビゲーション
- [x] 統計カード（枠組み）

#### インフラ
- [x] H2データベース設定
- [x] SQL Server設定
- [x] 開発/本番環境の分離

---

### 今後実装予定

#### プロジェクト管理
- [ ] Projectエンティティ
- [ ] ProjectRepository
- [ ] ProjectService
- [ ] ProjectController
- [ ] プロジェクト一覧画面
- [ ] プロジェクト詳細画面
- [ ] プロジェクト作成・編集・削除

#### タスク管理
- [ ] Taskエンティティ
- [ ] TaskRepository
- [ ] TaskService
- [ ] TaskController
- [ ] タスク一覧画面
- [ ] タスク詳細画面
- [ ] タスク作成・編集・削除
- [ ] タスクステータス管理
- [ ] 優先度管理

#### コメント機能
- [ ] Commentエンティティ
- [ ] CommentRepository
- [ ] CommentService
- [ ] CommentController
- [ ] コメント表示・追加・編集・削除

#### メンバー管理
- [ ] ProjectMemberエンティティ
- [ ] メンバー追加・削除
- [ ] ロール管理

#### 統計・レポート
- [ ] 実際の統計データ計算
- [ ] プロジェクト進捗率
- [ ] タスク完了率
- [ ] ユーザー別作業量

#### その他
- [ ] ユーザー登録機能
- [ ] パスワードリセット
- [ ] プロフィール編集
- [ ] 通知機能
- [ ] 検索機能
- [ ] フィルタリング機能

---

## 🚀 セットアップ方法

### 前提条件
- JDK 21以上
- Maven 3.6以上
- (本番環境) SQL Server

### 開発環境での起動

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd projectmanagement
```

2. **依存関係のインストール**
```bash
mvn clean install
```

3. **アプリケーションの起動**
```bash
mvn spring-boot:run
```

4. **アクセス**
- アプリケーション: http://localhost:8080
- H2コンソール: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (空)

### 本番環境での起動

1. **プロファイルの変更**
```bash
export SPRING_PROFILES_ACTIVE=prod
# または
set SPRING_PROFILES_ACTIVE=prod
```

2. **データベース接続情報の設定**
```bash
export DB_USERNAME=<your-username>
export DB_PASSWORD=<your-password>
```

3. **アプリケーションの起動**
```bash
mvn spring-boot:run
# または
java -jar target/projectmanagement-0.0.1-SNAPSHOT.jar
```

---

## 🧪 テスト

### テストユーザー

起動時に自動的に作成されるテストユーザー:

| ユーザー名 | パスワード | 権限 |
|---------|---------|-----|
| admin | admin123 | 管理者 |
| user1 | user123 | 一般ユーザー |
| user2 | user123 | 一般ユーザー |

---

## 📖 設計ドキュメント

プロジェクトには以下の設計ドキュメントが含まれています:

- **ERD.md** - エンティティ関係図（Mermaid形式）
- **ScreenTransition.md** - 画面遷移図
- **WFD_logintodashboard.md** - ログインからダッシュボードまでのワークフロー

---

## 🛠️ トラブルシューティング

### ログインできない
- テストユーザーの認証情報を確認してください
- H2コンソールでusersテーブルの存在を確認してください
- ブラウザのキャッシュをクリアしてください

### H2コンソールにアクセスできない
- `application.properties`で`spring.h2.console.enabled=true`になっているか確認
- URLが正しいか確認: http://localhost:8080/h2-console

### ポート8080が使用中
- `application.properties`で`server.port`を変更してください

---

## 📝 開発規約

### コーディングスタイル
- Java標準命名規則に従う
- メソッドには必ずJavaDocコメントを記述
- エラーメッセージは日本語で記述

### Git運用
- mainブランチ: 本番環境用
- developブランチ: 開発環境用
- feature/xxx: 機能開発用

### コミットメッセージ
```
[種類] 概要

詳細説明（必要に応じて）

種類:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル
- refactor: リファクタリング
- test: テスト
- chore: その他
```

---

## 📄 ライセンス

このプロジェクトは学習・開発目的で作成されています。

---

## 👥 貢献者

プロジェクトメンバー（今後追加）

---

## 📞 サポート

質問や問題がある場合は、GitHubのIssueを作成してください。

---

**最終更新日**: 2025年10月13日

