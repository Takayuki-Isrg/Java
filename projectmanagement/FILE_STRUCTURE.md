# ファイル構成一覧 - プロジェクト/タスク管理機能

## 📂 完全なファイルツリー

```
projectmanagement/
│
├── src/
│   ├── main/
│   │   ├── java/com/example/projectmanagement/    # ✅ 標準Maven構造に移行完了
│   │   │   │
│   │   │   ├── 📦 entity/                    # エンティティ層（ドメインモデル）
│   │   │   │   ├── ✅ User.java              # 実装済み - ユーザーエンティティ
│   │   │   │   ├── ✅ Project.java           # 実装済み - プロジェクトエンティティ
│   │   │   │   ├── ✅ ProjectMember.java     # 実装済み - プロジェクトメンバー
│   │   │   │   ├── 🆕 Task.java              # 新規 - タスクエンティティ
│   │   │   │   └── 🆕 Comment.java           # 新規 - コメントエンティティ
│   │   │   │
│   │   │   ├── 📦 repository/                # リポジトリ層（データアクセス）
│   │   │   │   ├── ✅ UserRepository.java    # 実装済み
│   │   │   │   ├── ✅ ProjectRepository.java # 実装済み
│   │   │   │   ├── 🆕 TaskRepository.java
│   │   │   │   ├── 🆕 ProjectMemberRepository.java
│   │   │   │   └── 🆕 CommentRepository.java
│   │   │   │
│   │   │   ├── 📦 service/                   # サービス層（ビジネスロジック）
│   │   │   │   ├── ✅ UserService.java       # 実装済み
│   │   │   │   ├── 🆕 ProjectService.java
│   │   │   │   ├── 🆕 TaskService.java
│   │   │   │   ├── 🆕 ProjectMemberService.java
│   │   │   │   └── 🆕 CommentService.java
│   │   │   │
│   │   │   ├── 📦 controller/                # コントローラ層（プレゼンテーション）
│   │   │   │   ├── ✅ UserController.java    # 実装済み
│   │   │   │   ├── ✅ DashboardController.java # 実装済み - 統計情報追加予定
│   │   │   │   ├── 🔧 ProjectController.java   # 修正 - 機能実装
│   │   │   │   ├── 🔧 TaskController.java      # 修正 - 機能実装
│   │   │   │   └── 🔧 CommentController.java   # 修正 - 機能実装
│   │   │   │
│   │   │   ├── 📦 dto/                       # DTO（データ転送オブジェクト）
│   │   │   │   ├── 🆕 ProjectDto.java
│   │   │   │   ├── 🆕 ProjectDetailDto.java
│   │   │   │   ├── 🆕 TaskDto.java
│   │   │   │   ├── 🆕 TaskDetailDto.java
│   │   │   │   ├── 🆕 CommentDto.java
│   │   │   │   ├── 🆕 ProjectStatisticsDto.java
│   │   │   │   └── 🆕 DashboardStatisticsDto.java
│   │   │   │
│   │   │   ├── 📦 form/                      # フォーム（入力データ）
│   │   │   │   ├── 🆕 ProjectForm.java
│   │   │   │   ├── 🆕 TaskForm.java
│   │   │   │   ├── 🆕 CommentForm.java
│   │   │   │   └── 🆕 ProjectMemberForm.java
│   │   │   │
│   │   │   ├── 📦 exception/                 # 例外クラス
│   │   │   │   ├── 🆕 ResourceNotFoundException.java
│   │   │   │   ├── 🆕 UnauthorizedException.java
│   │   │   │   └── 🆕 GlobalExceptionHandler.java
│   │   │   │
│   │   │   ├── 📦 config/                    # 設定クラス
│   │   │   │   ├── ✅ SecurityConfig.java    # 実装済み
│   │   │   │   └── ✅ DataInitializer.java   # 実装済み - 初期データ追加
│   │   │   │
│   │   │   ├── 📦 util/                      # ユーティリティ
│   │   │   │   └── 🆕 DateUtils.java         # オプション
│   │   │   │
│   │   │   └── ✅ ProjectManagerApplication.java # メインクラス（実装済み）
│   │   │
│   │   └── resources/
│   │       │
│   │       ├── 📄 application.properties      # 開発環境設定（実装済み）
│   │       ├── 📄 application-prod.properties # 本番環境設定（実装済み）
│   │       │
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   ├── ✅ style.projectmanagement.css
│   │       │   │   └── ✅ style.dashboard.css
│   │       │   │
│   │       │   └── js/
│   │       │       ├── 🆕 kanban.js          # カンバンボード用
│   │       │       ├── 🆕 task.js            # タスク操作用
│   │       │       └── 🆕 project.js         # プロジェクト操作用
│   │       │
│   │       └── templates/
│   │           │
│   │           ├── layout/                   # レイアウト（共通部品）
│   │           │   ├── 🆕 navbar.html        # ナビゲーションバー
│   │           │   └── 🆕 footer.html        # フッター
│   │           │
│   │           ├── user/                     # ユーザー関連画面
│   │           │   └── ✅ login.html         # 実装済み
│   │           │
│   │           ├── 🔧 dashboard.html         # 修正 - 統計情報表示
│   │           │
│   │           ├── project/                  # プロジェクト関連画面
│   │           │   ├── 🆕 list.html          # プロジェクト一覧
│   │           │   ├── 🆕 detail.html        # プロジェクト詳細
│   │           │   ├── 🆕 form.html          # プロジェクト作成・編集
│   │           │   └── 🆕 members.html       # メンバー管理
│   │           │
│   │           └── task/                     # タスク関連画面
│   │               ├── 🔧 list.html          # 修正 - タスク一覧
│   │               ├── 🆕 detail.html        # タスク詳細
│   │               ├── 🆕 form.html          # タスク作成・編集
│   │               └── 🆕 kanban.html        # カンバンボード
│   │
│   └── test/                                 # テストコード（今後実装）
│       └── java/com/example/
│           ├── 🔜 ProjectServiceTest.java
│           ├── 🔜 TaskServiceTest.java
│           └── 🔜 ...
│
├── 📄 pom.xml                                # Maven設定（実装済み）
├── 📄 README.md                              # プロジェクト概要（作成済み）
├── 📄 CHANGELOG.md                           # 変更履歴（作成済み）
├── 📄 TECHNICAL_SPEC.md                      # 技術仕様書（作成済み）
├── 📄 SETUP_GUIDE.md                         # セットアップガイド（作成済み）
├── 📄 IMPLEMENTATION_PLAN.md                 # 実装計画書（作成済み）
├── 📄 QUICK_REFERENCE.md                     # クイックリファレンス（作成済み）
├── 📄 FILE_STRUCTURE.md                      # このファイル
├── 📄 ERD.md                                 # データベース設計（作成済み）
├── 📄 ScreenTransition.md                    # 画面遷移図（作成済み）
└── 📄 WFD_logintodashboard.md               # ワークフロー図（作成済み）
```

---

## 📊 実装状況サマリー

### ステータス凡例
- ✅ **実装済み** - すでに完成している
- 🔧 **修正対象** - 既存ファイルを修正する
- 🆕 **新規作成** - これから作成する
- 🔜 **将来実装** - 今後実装予定

### カテゴリ別集計

| カテゴリ | 実装済み | 修正 | 新規 | 合計 |
|---------|---------|-----|-----|------|
| **エンティティ** | 3 | 0 | 2 | 5 |
| **リポジトリ** | 2 | 0 | 3 | 5 |
| **サービス** | 1 | 0 | 4 | 5 |
| **コントローラ** | 2 | 3 | 0 | 5 |
| **DTO** | 0 | 0 | 7 | 7 |
| **フォーム** | 0 | 0 | 4 | 4 |
| **例外** | 0 | 0 | 3 | 3 |
| **設定** | 2 | 0 | 0 | 2 |
| **テンプレート** | 2 | 2 | 10 | 14 |
| **JavaScript** | 0 | 0 | 3 | 3 |
| **ドキュメント** | 10 | 0 | 0 | 10 |
| **合計** | **22** | **5** | **36** | **63** |

---

## 🎯 実装順序別ファイルリスト

### フェーズ1: プロジェクト管理の基礎（7ファイル）

#### 1.1 エンティティ・リポジトリ
```
1. entity/Project.java
2. entity/ProjectMember.java
3. repository/ProjectRepository.java
4. repository/ProjectMemberRepository.java
```

#### 1.2 サービス・DTO・フォーム
```
5. dto/ProjectDto.java
6. form/ProjectForm.java
7. service/ProjectService.java
```

### フェーズ2: プロジェクト画面（5ファイル）

```
8. controller/ProjectController.java        # 修正
9. templates/project/list.html
10. templates/project/detail.html
11. templates/project/form.html
12. templates/layout/navbar.html            # 共通ナビ
```

### フェーズ3: タスク管理の基礎（7ファイル）

#### 3.1 エンティティ・リポジトリ
```
13. entity/Task.java
14. repository/TaskRepository.java
```

#### 3.2 サービス・DTO・フォーム
```
15. dto/TaskDto.java
16. dto/TaskDetailDto.java
17. form/TaskForm.java
18. service/TaskService.java
```

#### 3.3 コントローラ
```
19. controller/TaskController.java          # 修正
```

### フェーズ4: タスク画面（5ファイル）

```
20. templates/task/list.html                # 修正
21. templates/task/detail.html
22. templates/task/form.html
23. templates/task/kanban.html
24. static/js/kanban.js
```

### フェーズ5: コメント機能（7ファイル）

```
25. entity/Comment.java
26. repository/CommentRepository.java
27. dto/CommentDto.java
28. form/CommentForm.java
29. service/CommentService.java
30. controller/CommentController.java       # 修正
31. task/detail.html への追加               # コメント表示
```

### フェーズ6: 統計・ダッシュボード（4ファイル）

```
32. dto/ProjectStatisticsDto.java
33. dto/DashboardStatisticsDto.java
34. controller/DashboardController.java     # 修正
35. templates/dashboard.html                # 修正
```

### フェーズ7: 例外処理・その他（8ファイル）

```
36. exception/ResourceNotFoundException.java
37. exception/UnauthorizedException.java
38. exception/GlobalExceptionHandler.java
39. dto/ProjectDetailDto.java
40. form/ProjectMemberForm.java
41. service/ProjectMemberService.java
42. templates/project/members.html
43. config/DataInitializer.java             # 修正
```

---

## 📋 ファイル別詳細情報

### エンティティ層の関係図

```
User (既存)
 ├─→ Project (作成者)
 ├─→ ProjectMember (メンバーとして)
 ├─→ Task (担当者として)
 └─→ Comment (コメント投稿者)

Project (新規)
 ├─→ ProjectMember (プロジェクトのメンバー)
 └─→ Task (プロジェクトのタスク)

Task (新規)
 └─→ Comment (タスクのコメント)

ProjectMember (新規)
 ├─ Project への参照
 └─ User への参照

Comment (新規)
 ├─ Task への参照
 └─ User への参照
```

### 各層の依存関係

```
Controller 層
    ↓ 依存
Service 層
    ↓ 依存
Repository 層
    ↓ 依存
Entity 層

※DTO・Formは各層で使用
※Exceptionは全層で使用可能
```

---

## 🔄 データフロー（レイヤー間）

### 作成処理のフロー

```
1. Form (入力)
   ↓
2. Controller (受け取り・検証)
   ↓
3. Service (ビジネスロジック)
   ↓ Form → Entity 変換
4. Repository (永続化)
   ↓
5. Database (保存)
   ↓
6. Repository (Entity 返却)
   ↓
7. Service (Entity → DTO 変換)
   ↓
8. Controller (画面遷移)
   ↓
9. View (表示)
```

### 取得処理のフロー

```
1. Controller (リクエスト受付)
   ↓
2. Service (取得ロジック)
   ↓
3. Repository (クエリ実行)
   ↓
4. Database (データ取得)
   ↓
5. Repository (Entity 返却)
   ↓
6. Service (Entity → DTO 変換)
   ↓
7. Controller (Model に追加)
   ↓
8. View (表示)
```

---

## 📝 ファイル命名規則

### Javaクラス

| 種類 | 命名パターン | 例 |
|-----|-----------|---|
| Entity | 単数形、名詞 | Project.java, Task.java |
| Repository | Entity名 + Repository | ProjectRepository.java |
| Service | Entity名 + Service | ProjectService.java |
| Controller | Entity名 + Controller | ProjectController.java |
| DTO | Entity名 + Dto | ProjectDto.java |
| DetailDTO | Entity名 + DetailDto | ProjectDetailDto.java |
| Form | 用途 + Form | ProjectForm.java |
| Exception | 用途 + Exception | ResourceNotFoundException.java |

### テンプレート

| 種類 | 命名パターン | 例 |
|-----|-----------|---|
| 一覧画面 | list.html | project/list.html |
| 詳細画面 | detail.html | project/detail.html |
| フォーム画面 | form.html | project/form.html |
| その他機能 | 機能名.html | project/members.html |

### JavaScript

| 種類 | 命名パターン | 例 |
|-----|-----------|---|
| 機能別JS | 機能名.js | kanban.js, task.js |

---

## 🗂️ パッケージ構成の理由

### エンティティ層（entity）
- データベーステーブルと1対1対応
- ドメインモデルの中核
- 他のパッケージへの依存なし

### リポジトリ層（repository）
- データアクセスの抽象化
- エンティティにのみ依存
- Spring Data JPAによる自動実装

### サービス層（service）
- ビジネスロジックの実装
- トランザクション境界
- Repository と Entity に依存

### コントローラ層（controller）
- HTTPリクエストの処理
- Service, DTO, Form に依存
- ビュー名の返却

### DTO層（dto）
- 層間のデータ転送
- Entityの情報を必要な分だけ公開
- どの層でも使用可能

### フォーム層（form）
- 入力データのバリデーション
- Controller で使用
- Entityとは独立

### 例外層（exception）
- エラーハンドリングの統一
- 全層で使用可能
- グローバルハンドラーで一括処理

---

## 💡 実装のポイント

### 1. エンティティ作成時
- `@Entity` と `@Table` を必ず付ける
- 関連は `FetchType.LAZY` を使う（N+1問題防止）
- タイムスタンプは `@PrePersist` / `@PreUpdate` で自動設定

### 2. リポジトリ作成時
- メソッド名でクエリを自動生成
- 複雑なクエリは `@Query` を使う
- ページネーションは `Pageable` を使う

### 3. サービス作成時
- `@Transactional` でトランザクション管理
- 読み取り専用は `readOnly = true` を設定
- Entity ↔ DTO 変換メソッドを作る

### 4. コントローラ作成時
- `@Valid` で入力検証
- `BindingResult` でエラーハンドリング
- リダイレクト時は `RedirectAttributes` でメッセージ

### 5. テンプレート作成時
- Thymeleaf の `th:` プレフィックスを使う
- CSRFトークンを忘れずに
- エラーメッセージ表示を実装

---

## 🚀 次のステップ

このファイル構成に基づいて実装を進めてください：

1. **IMPLEMENTATION_PLAN.md** で実装順序を確認
2. **QUICK_REFERENCE.md** でコードテンプレートを参照
3. **TECHNICAL_SPEC.md** で技術詳細を確認
4. 実装したら **CHANGELOG.md** を更新

---

## 🔄 構造変更履歴

### 2025年11月1日 - 標準Maven構造への移行完了 ✅

**変更内容:**
- **旧構造:** `src/com/example/main/java/` (非標準)
- **新構造:** `src/main/java/com/example/projectmanagement/` (Maven標準)

**移行された項目:**
- ✅ 全14個のJavaファイルを新構造に移行し、package宣言を修正
- ✅ resourcesフォルダを `src/main/resources/` に移動
- ✅ testフォルダを標準構造 `src/test/java/` に整備
- ✅ 旧フォルダを削除してクリーンアップ完了
- ✅ pom.xmlは標準設定のため変更不要

**メリット:**
- IDEの自動認識が改善
- Mavenコマンドが標準設定で動作
- 他の開発者にとって理解しやすい構造
- 業界標準に準拠

---

**最終更新日**: 2025年11月1日

