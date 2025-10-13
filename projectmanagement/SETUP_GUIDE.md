# セットアップガイド (Setup Guide)

このドキュメントでは、プロジェクト管理システムの開発環境セットアップ手順を説明します。

---

## 📋 目次

1. [前提条件](#前提条件)
2. [開発環境セットアップ](#開発環境セットアップ)
3. [本番環境セットアップ](#本番環境セットアップ)
4. [トラブルシューティング](#トラブルシューティング)
5. [よくある質問](#よくある質問)

---

## 前提条件

### 必須ソフトウェア

#### 1. JDK 21以上
**インストール確認:**
```bash
java -version
```

**期待される出力:**
```
java version "21.0.x" or higher
```

**インストール方法:**
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- [OpenJDK](https://adoptium.net/)

#### 2. Maven 3.6以上
**インストール確認:**
```bash
mvn -version
```

**期待される出力:**
```
Apache Maven 3.6.x or higher
```

**インストール方法:**
- [Maven公式サイト](https://maven.apache.org/download.cgi)
- Windows: [Chocolatey](https://chocolatey.org/) を使用
  ```bash
  choco install maven
  ```

#### 3. Git
**インストール確認:**
```bash
git --version
```

**インストール方法:**
- [Git公式サイト](https://git-scm.com/)

### 推奨ソフトウェア

#### IDE
以下のいずれかを推奨:
- **IntelliJ IDEA** (Community/Ultimate)
- **Eclipse IDE** (Java EE Developers版)
- **Visual Studio Code** (Spring Boot Extension Pack)

#### データベース（本番環境用）
- **Microsoft SQL Server** 2019以上

---

## 開発環境セットアップ

### 1. リポジトリのクローン

```bash
# HTTPSの場合
git clone https://github.com/your-username/projectmanagement.git

# SSHの場合
git clone git@github.com:your-username/projectmanagement.git

# プロジェクトディレクトリに移動
cd projectmanagement
```

### 2. 依存関係のインストール

```bash
mvn clean install
```

**実行内容:**
- 依存ライブラリのダウンロード
- プロジェクトのコンパイル
- ユニットテストの実行（実装後）
- JARファイルの生成

**所要時間:** 初回は5-10分程度（依存関係のダウンロード）

### 3. アプリケーションの起動

#### 方法1: Mavenコマンド
```bash
mvn spring-boot:run
```

#### 方法2: JAR実行
```bash
mvn package
java -jar target/projectmanagement-0.0.1-SNAPSHOT.jar
```

#### 方法3: IDEから実行
1. `ProjectManagerApplication.java` を開く
2. `main` メソッドを右クリック
3. 「Run」または「Debug」を選択

### 4. アプリケーションへのアクセス

**ブラウザを開いて以下にアクセス:**

#### メインアプリケーション
```
http://localhost:8080
```
→ ログイン画面が表示されます

#### H2 データベースコンソール
```
http://localhost:8080/h2-console
```

**H2接続情報:**
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (空白)

### 5. ログイン

**テストユーザーでログイン:**

| ユーザー名 | パスワード | 説明 |
|---------|---------|------|
| admin | admin123 | 管理者ユーザー |
| user1 | user123 | 一般ユーザー1 |
| user2 | user123 | 一般ユーザー2 |

### 6. 開発モードの確認

起動時のログに以下が表示されていることを確認:

```
Started ProjectManagerApplication in x.xxx seconds
Active profiles: dev
H2 console available at '/h2-console'
```

---

## 本番環境セットアップ

### 1. SQL Serverの準備

#### データベース作成
```sql
-- SQL Serverに接続して実行
CREATE DATABASE project_management_db;
GO

USE project_management_db;
GO
```

#### ユーザー作成（オプション）
```sql
CREATE LOGIN project_user WITH PASSWORD = 'YourSecurePassword123!';
GO

USE project_management_db;
GO

CREATE USER project_user FOR LOGIN project_user;
GO

-- 権限付与
ALTER ROLE db_owner ADD MEMBER project_user;
GO
```

### 2. 環境変数の設定

#### Windows (PowerShell)
```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DB_USERNAME="project_user"
$env:DB_PASSWORD="YourSecurePassword123!"
```

#### Windows (コマンドプロンプト)
```cmd
set SPRING_PROFILES_ACTIVE=prod
set DB_USERNAME=project_user
set DB_PASSWORD=YourSecurePassword123!
```

#### Linux / macOS
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_USERNAME=project_user
export DB_PASSWORD=YourSecurePassword123!
```

### 3. 接続文字列の確認

`application-prod.properties` を確認:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=project_management_db;encrypt=true;trustServerCertificate=true
```

**注意:** 本番環境では `trustServerCertificate=false` にして、適切な証明書を設定してください。

### 4. アプリケーションのビルド

```bash
mvn clean package -DskipTests
```

### 5. アプリケーションの起動

```bash
java -jar target/projectmanagement-0.0.1-SNAPSHOT.jar
```

### 6. 動作確認

```
http://your-server-ip:8080
```

---

## IDEでのセットアップ

### IntelliJ IDEA

#### 1. プロジェクトのインポート
1. `File` → `Open`
2. プロジェクトディレクトリの `pom.xml` を選択
3. 「Open as Project」を選択
4. Mavenの依存関係が自動的にダウンロードされます

#### 2. Spring Boot設定
1. `Run` → `Edit Configurations`
2. 左上の `+` → `Spring Boot`
3. Main class: `com.example.ProjectManagerApplication`
4. Active profiles: `dev`
5. 「OK」をクリック

#### 3. 実行
- `Shift + F10`: 実行
- `Shift + F9`: デバッグ実行

### Eclipse

#### 1. プロジェクトのインポート
1. `File` → `Import`
2. `Maven` → `Existing Maven Projects`
3. プロジェクトディレクトリを選択
4. 「Finish」をクリック

#### 2. Spring Boot設定
1. `Run` → `Run Configurations`
2. `Java Application` → `New Configuration`
3. Project: projectmanagement
4. Main class: `com.example.ProjectManagerApplication`
5. Arguments タブ → VM arguments: `-Dspring.profiles.active=dev`
6. 「Apply」→「Run」

### Visual Studio Code

#### 1. 拡張機能のインストール
- Java Extension Pack
- Spring Boot Extension Pack

#### 2. プロジェクトを開く
```bash
code projectmanagement
```

#### 3. 実行
1. `ProjectManagerApplication.java` を開く
2. `main` メソッド上部の「Run」リンクをクリック

---

## トラブルシューティング

### 問題1: ポート8080が既に使用中

**エラーメッセージ:**
```
Web server failed to start. Port 8080 was already in use.
```

**解決方法1:** ポートを変更
```properties
# application.properties に追加
server.port=8081
```

**解決方法2:** 既存のプロセスを停止
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID番号> /F

# Linux / macOS
lsof -i :8080
kill -9 <PID番号>
```

### 問題2: JDKバージョンエラー

**エラーメッセージ:**
```
invalid target release: 21
```

**解決方法:**
1. JDK 21以上がインストールされているか確認
2. `JAVA_HOME` 環境変数の設定確認
```bash
echo %JAVA_HOME%  # Windows
echo $JAVA_HOME   # Linux/macOS
```

### 問題3: Mavenの依存関係エラー

**エラーメッセージ:**
```
Failed to read artifact descriptor for ...
```

**解決方法:**
```bash
# Mavenキャッシュをクリア
mvn dependency:purge-local-repository

# 再度インストール
mvn clean install
```

### 問題4: H2コンソールにアクセスできない

**確認事項:**
1. `application.properties` で H2 コンソールが有効になっているか
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

2. 正しいURLでアクセスしているか
```
http://localhost:8080/h2-console
```

3. Spring Securityの設定で許可されているか
```java
.requestMatchers("/h2-console/**").permitAll()
```

### 問題5: データベース接続エラー（本番環境）

**エラーメッセージ:**
```
Connection refused / Login failed
```

**チェックリスト:**
- [ ] SQL Serverが起動しているか
- [ ] データベース名が正しいか
- [ ] ユーザー名・パスワードが正しいか
- [ ] ファイアウォールでポート1433が開いているか
- [ ] SQL Server認証が有効になっているか

**SQL Server認証の有効化:**
1. SQL Server Management Studio を開く
2. サーバーを右クリック → Properties
3. Security → SQL Server and Windows Authentication mode
4. SQL Serverを再起動

### 問題6: CSRF トークンエラー

**エラーメッセージ:**
```
403 Forbidden - Invalid CSRF Token
```

**解決方法:**
テンプレートにCSRFトークンが含まれているか確認:
```html
<input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
```

---

## よくある質問

### Q1: 開発環境でHTTPSを有効にできますか？

**A:** はい、可能です。

```properties
# application.properties
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
```

自己署名証明書の生成:
```bash
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore keystore.p12 -validity 3650
```

### Q2: データベースをリセットするには？

**A:** H2インメモリDBの場合、アプリケーションを再起動するだけです。

SQL Serverの場合:
```sql
USE project_management_db;
GO

-- 全テーブル削除
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
GO
```

### Q3: 別のデータベースを使用できますか？

**A:** はい。Spring Boot はMySQL、PostgreSQLなど多くのDBをサポートしています。

**MySQL の例:**
1. 依存関係を追加:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. 設定変更:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_management_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Q4: ログレベルを変更するには？

**A:** `application.properties` で設定:

```properties
# ルートログレベル
logging.level.root=INFO

# パッケージ別
logging.level.com.example=DEBUG
logging.level.org.springframework.security=WARN
logging.level.org.hibernate.SQL=DEBUG
```

### Q5: 本番環境でH2コンソールは無効化すべきですか？

**A:** はい、必ず無効化してください。

```properties
# application-prod.properties
spring.h2.console.enabled=false
```

---

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください:

- **[README.md](./README.md)** - プロジェクト概要
- **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - 技術仕様
- **[CHANGELOG.md](./CHANGELOG.md)** - 変更履歴
- **[ERD.md](./ERD.md)** - データベース設計

---

## サポート

問題が解決しない場合:
1. GitHubのIssueを作成
2. プロジェクトチームに連絡
3. ログファイルを確認（`logs/spring.log`）

---

**最終更新日**: 2025年10月13日

