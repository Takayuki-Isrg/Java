# 技術仕様書 (Technical Specification)

## 📋 目次

1. [システムアーキテクチャ](#システムアーキテクチャ)
2. [技術スタック詳細](#技術スタック詳細)
3. [データベース設計](#データベース設計)
4. [API設計](#api設計)
5. [セキュリティ設計](#セキュリティ設計)
6. [エラーハンドリング](#エラーハンドリング)
7. [パフォーマンス要件](#パフォーマンス要件)
8. [開発環境](#開発環境)

---

## システムアーキテクチャ

### アプリケーションアーキテクチャ

本システムは**レイヤードアーキテクチャ**を採用しています。

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Controllers / Views / Templates)  │
├─────────────────────────────────────┤
│        Service Layer                │
│    (Business Logic / Services)      │
├─────────────────────────────────────┤
│      Repository Layer               │
│   (Data Access / Repositories)      │
├─────────────────────────────────────┤
│         Entity Layer                │
│    (Domain Models / Entities)       │
├─────────────────────────────────────┤
│        Database Layer               │
│       (H2 / SQL Server)             │
└─────────────────────────────────────┘
```

### レイヤーの責務

#### 1. プレゼンテーション層 (Presentation Layer)
**パッケージ**: `com.example.controller`, `templates/`

**責務:**
- HTTPリクエストの受信
- 入力データのバリデーション
- サービス層の呼び出し
- ビューの選択とモデルデータの設定
- HTTPレスポンスの返却

**主なコンポーネント:**
- `UserController` - ユーザー関連の画面制御
- `DashboardController` - ダッシュボード画面制御
- `ProjectController` - プロジェクト管理（予定）
- `TaskController` - タスク管理（予定）
- `CommentController` - コメント機能（予定）

#### 2. サービス層 (Service Layer)
**パッケージ**: `com.example.service`

**責務:**
- ビジネスロジックの実装
- トランザクション管理
- リポジトリ層の呼び出し
- ビジネスルールの検証
- データ変換（Entity ↔ DTO）

**主なコンポーネント:**
- `UserService` - ユーザー管理ロジック

**トランザクション境界:**
```java
@Service
@Transactional  // デフォルト: 読み書き可能
public class UserService {
    
    @Transactional(readOnly = true)  // 読み取り専用
    public Optional<User> findByUsername(String username) {
        // ...
    }
    
    // 書き込み操作は@Transactionalのみ
    public User createUser(User user) {
        // ...
    }
}
```

#### 3. リポジトリ層 (Repository Layer)
**パッケージ**: `com.example.repository`

**責務:**
- データベースアクセス
- クエリの実装
- CRUD操作

**主なコンポーネント:**
- `UserRepository` - ユーザーデータアクセス

**実装パターン:**
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPAによる自動実装
    Optional<User> findByUsername(String username);
    
    // カスタムクエリ（必要に応じて）
    @Query("SELECT u FROM User u WHERE u.enabled = true")
    List<User> findAllActiveUsers();
}
```

#### 4. エンティティ層 (Entity Layer)
**パッケージ**: `com.example.entity`

**責務:**
- ドメインモデルの定義
- データベーステーブルとのマッピング
- バリデーションルールの定義

**主なコンポーネント:**
- `User` - ユーザーエンティティ

---

## 技術スタック詳細

### バックエンド

#### Spring Boot 3.1.0
- **spring-boot-starter-web**: RESTful API / MVC
- **spring-boot-starter-security**: 認証・認可
- **spring-boot-starter-data-jpa**: ORM / データベースアクセス
- **spring-boot-starter-thymeleaf**: テンプレートエンジン
- **spring-boot-starter-validation**: Bean Validation

#### Java 21
**使用機能:**
- Records（今後のDTO実装で使用予定）
- Pattern Matching
- Text Blocks（SQLクエリなど）
- Virtual Threads（パフォーマンス改善時に検討）

### データベース

#### 開発環境: H2 Database
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

**特徴:**
- インメモリデータベース
- 起動時にスキーマ自動作成
- H2コンソールで直接確認可能
- 高速な開発サイクル

#### 本番環境: Microsoft SQL Server
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=project_management_db
spring.jpa.hibernate.ddl-auto=update
```

**特徴:**
- エンタープライズグレードのRDBMS
- トランザクション保証
- スケーラビリティ
- バックアップ・リストア機能

### フロントエンド

#### Bootstrap 5.3.0
**使用コンポーネント:**
- Grid System（レスポンシブレイアウト）
- Cards（情報表示）
- Navbar（ナビゲーション）
- Buttons（アクション）
- Forms（入力フォーム）
- Alerts（メッセージ表示）
- Dropdowns（メニュー）

#### Bootstrap Icons 1.10.0
**使用アイコン:**
- `bi-kanban` - プロジェクト管理アイコン
- `bi-house` - ホーム
- `bi-folder` - プロジェクト
- `bi-list-task` - タスク
- `bi-person-circle` - ユーザー
- その他多数

#### Thymeleaf
**使用機能:**
- テンプレート継承（レイアウト）
- 式言語（${}, *{}, @{}）
- 条件分岐（th:if）
- ループ（th:each）
- Spring Security統合（sec:authorize）

---

## データベース設計

### 実装済みテーブル

#### users テーブル
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_enabled BOOLEAN DEFAULT TRUE,
    is_account_non_expired BOOLEAN DEFAULT TRUE,
    is_account_non_locked BOOLEAN DEFAULT TRUE,
    is_credentials_non_expired BOOLEAN DEFAULT TRUE
);

-- インデックス
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
```

**カラム説明:**
| カラム名 | 型 | 制約 | 説明 |
|---------|---|-----|------|
| id | BIGINT | PK, AUTO_INCREMENT | ユーザーID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | ユーザー名（ログイン用） |
| password | VARCHAR(255) | NOT NULL | パスワード（BCrypt暗号化） |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| display_name | VARCHAR(100) | NOT NULL | 表示名 |
| created_at | TIMESTAMP | - | 作成日時 |
| updated_at | TIMESTAMP | - | 更新日時 |
| is_enabled | BOOLEAN | DEFAULT TRUE | アカウント有効フラグ |
| is_account_non_expired | BOOLEAN | DEFAULT TRUE | アカウント期限切れフラグ |
| is_account_non_locked | BOOLEAN | DEFAULT TRUE | アカウントロックフラグ |
| is_credentials_non_expired | BOOLEAN | DEFAULT TRUE | 認証情報期限切れフラグ |

### 今後実装予定のテーブル

#### projects テーブル
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### tasks テーブル
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'TODO',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    assigned_user_id BIGINT,
    deadline DATE,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_user_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### project_members テーブル
```sql
CREATE TABLE project_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role_in_project VARCHAR(20) DEFAULT 'MEMBER',
    joined_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(project_id, user_id)
);
```

#### comments テーブル
```sql
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### エンティティ関係図

詳細は `ERD.md` を参照してください。

```
User (1) ←→ (N) ProjectMember (N) ←→ (1) Project
  │                                        │
  │ (1)                                    │ (1)
  │                                        │
  ↓ (N)                                    ↓ (N)
Task (1) ←→ (N) Comment
```

---

## API設計

### 現在実装されているエンドポイント

#### 認証関連

| メソッド | エンドポイント | 説明 | 認証 |
|---------|-------------|------|-----|
| GET | /login | ログイン画面表示 | 不要 |
| POST | /login | ログイン処理（Spring Security） | 不要 |
| POST | /logout | ログアウト処理 | 必要 |
| GET | /register | 登録画面表示 | 不要 |

#### ダッシュボード

| メソッド | エンドポイント | 説明 | 認証 |
|---------|-------------|------|-----|
| GET | /dashboard | ダッシュボード表示 | 必要 |

### 今後実装予定のエンドポイント

#### プロジェクト管理

| メソッド | エンドポイント | 説明 | 認証 |
|---------|-------------|------|-----|
| GET | /projects | プロジェクト一覧 | 必要 |
| GET | /projects/new | プロジェクト作成画面 | 必要 |
| POST | /projects | プロジェクト作成 | 必要 |
| GET | /projects/{id} | プロジェクト詳細 | 必要 |
| GET | /projects/{id}/edit | プロジェクト編集画面 | 必要 |
| PUT | /projects/{id} | プロジェクト更新 | 必要 |
| DELETE | /projects/{id} | プロジェクト削除 | 必要 |

#### タスク管理

| メソッド | エンドポイント | 説明 | 認証 |
|---------|-------------|------|-----|
| GET | /tasks | タスク一覧 | 必要 |
| GET | /tasks/new | タスク作成画面 | 必要 |
| POST | /tasks | タスク作成 | 必要 |
| GET | /tasks/{id} | タスク詳細 | 必要 |
| GET | /tasks/{id}/edit | タスク編集画面 | 必要 |
| PUT | /tasks/{id} | タスク更新 | 必要 |
| DELETE | /tasks/{id} | タスク削除 | 必要 |
| PATCH | /tasks/{id}/status | タスクステータス更新 | 必要 |

#### コメント

| メソッド | エンドポイント | 説明 | 認証 |
|---------|-------------|------|-----|
| POST | /tasks/{taskId}/comments | コメント追加 | 必要 |
| PUT | /comments/{id} | コメント編集 | 必要 |
| DELETE | /comments/{id} | コメント削除 | 必要 |

---

## セキュリティ設計

### 認証方式

**フォームベース認証**を採用しています。

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register", "/css/**", "/js/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error")
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
            );
        return http.build();
    }
}
```

### パスワード暗号化

**BCrypt**アルゴリズムを使用（強度10）。

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

**特徴:**
- ソルト自動生成
- スローハッシュ（レインボーテーブル攻撃対策）
- 業界標準の暗号化方式

### CSRF保護

Spring Securityのデフォルト設定でCSRF保護が有効化されています。

```html
<!-- Thymeleafテンプレートで自動的にCSRFトークンを埋め込み -->
<form action="/login" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
    <!-- フォームフィールド -->
</form>
```

### セッション管理

```properties
# セッションタイムアウト: 30分
server.servlet.session.timeout=30m

# HTTPOnlyクッキー（XSS対策）
server.servlet.session.cookie.http-only=true

# セキュアクッキー（HTTPS環境で有効化）
server.servlet.session.cookie.secure=false  # 開発環境ではfalse
```

### アクセス制御

#### 現在の設定
- 公開リソース: `/login`, `/register`, `/css/**`, `/js/**`
- 認証必須: その他すべて

#### 今後実装予定（ロールベース）
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/admin/**").hasRole("ADMIN")
    .requestMatchers("/projects/*/delete").hasAnyRole("ADMIN", "PROJECT_MANAGER")
    .requestMatchers("/projects/**").hasRole("USER")
    .anyRequest().authenticated()
)
```

### セキュリティヘッダー

Spring Securityがデフォルトで以下のヘッダーを追加:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Cache-Control: no-cache, no-store, must-revalidate`

---

## エラーハンドリング

### バリデーションエラー

```java
@NotBlank(message = "ユーザー名は必須です")
@Size(min = 3, max = 50, message = "ユーザー名は3文字以上50文字以下で入力してください")
private String username;
```

### ビジネスロジックエラー

```java
public User createUser(User user) {
    if (userRepository.existsByUsername(user.getUsername())) {
        throw new IllegalArgumentException("このユーザー名は既に使用されています");
    }
    // ...
}
```

### 今後実装予定

#### カスタム例外クラス
```java
// com.example.exception パッケージ
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id));
    }
}
```

#### グローバル例外ハンドラー
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ModelAndView handleUserAlreadyExists(UserAlreadyExistsException ex) {
        // エラーページの表示
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ModelAndView handleResourceNotFound(ResourceNotFoundException ex) {
        // 404ページの表示
    }
}
```

---

## パフォーマンス要件

### 現在の状況
- 開発環境: インメモリDB使用で高速
- ページロード時間: < 1秒（ローカル環境）

### 今後の最適化計画

#### データベース最適化
- インデックスの追加（username, email）
- N+1問題の解決（fetch join使用）
- クエリの最適化

#### キャッシング戦略
```java
@Cacheable(value = "users", key = "#username")
public Optional<User> findByUsername(String username) {
    // ...
}
```

#### ページネーション
```java
@GetMapping("/projects")
public String listProjects(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    Model model
) {
    Page<Project> projects = projectService.findAll(
        PageRequest.of(page, size, Sort.by("createdAt").descending())
    );
    // ...
}
```

---

## 開発環境

### 必須ソフトウェア
- **JDK**: 21以上
- **Maven**: 3.6以上
- **IDE**: IntelliJ IDEA / Eclipse / VSCode

### 推奨ツール
- **Git**: バージョン管理
- **Docker**: コンテナ化（今後）
- **Postman**: API テスト（REST API実装時）

### 開発サーバー起動
```bash
mvn spring-boot:run
```

### ホットリロード
Spring Boot DevToolsを追加すると自動リロード可能:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## コーディング規約

### Java
- Google Java Style Guideに準拠
- メソッドには必ずJavaDocコメント
- クラスには責務を明確にしたコメント

### SQL
- テーブル名: 複数形（users, projects）
- カラム名: スネークケース（created_at）
- インデックス名: idx_テーブル名_カラム名

### Thymeleaf
- th:プレフィックスを明示的に使用
- セキュリティ: th:textでエスケープ、th:utextは慎重に使用

---

**最終更新日**: 2025年10月13日

