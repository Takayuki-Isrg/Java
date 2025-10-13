# プロジェクト/タスク管理機能 実装計画書

## 📋 目次

1. [実装概要](#実装概要)
2. [作成・修正対象ファイル一覧](#作成修正対象ファイル一覧)
3. [データフロー](#データフロー)
4. [実装順序](#実装順序)
5. [各ファイルの詳細仕様](#各ファイルの詳細仕様)
6. [画面遷移フロー](#画面遷移フロー)

---

## 実装概要

### 実装する機能

#### 1. プロジェクト管理
- ✅ プロジェクト一覧表示
- ✅ プロジェクト作成
- ✅ プロジェクト詳細表示
- ✅ プロジェクト編集
- ✅ プロジェクト削除
- ✅ プロジェクトメンバー管理

#### 2. タスク管理
- ✅ タスク一覧表示
- ✅ タスク作成
- ✅ タスク詳細表示
- ✅ タスク編集
- ✅ タスク削除
- ✅ タスクステータス変更
- ✅ タスク優先度設定

#### 3. コメント機能
- ✅ コメント表示
- ✅ コメント追加
- ✅ コメント編集
- ✅ コメント削除

---

## 作成・修正対象ファイル一覧

### 📁 新規作成ファイル（30ファイル）

#### エンティティ層（4ファイル）
```
src/main/java/com/example/entity/
├── Project.java           ← 新規作成
├── Task.java             ← 新規作成
├── ProjectMember.java    ← 新規作成
└── Comment.java          ← 新規作成
```

#### リポジトリ層（4ファイル）
```
src/main/java/com/example/repository/
├── ProjectRepository.java       ← 新規作成
├── TaskRepository.java          ← 新規作成
├── ProjectMemberRepository.java ← 新規作成
└── CommentRepository.java       ← 新規作成
```

#### サービス層（4ファイル）
```
src/main/java/com/example/service/
├── ProjectService.java       ← 新規作成
├── TaskService.java          ← 新規作成
├── ProjectMemberService.java ← 新規作成
└── CommentService.java       ← 新規作成
```

#### DTO層（7ファイル）
```
src/main/java/com/example/dto/
├── ProjectDto.java         ← 新規作成
├── TaskDto.java            ← 新規作成
├── CommentDto.java         ← 新規作成
├── ProjectDetailDto.java   ← 新規作成
├── TaskDetailDto.java      ← 新規作成
├── ProjectStatisticsDto.java ← 新規作成
└── DashboardStatisticsDto.java ← 新規作成
```

#### フォーム層（4ファイル）
```
src/main/java/com/example/form/
├── ProjectForm.java        ← 新規作成
├── TaskForm.java           ← 新規作成
├── CommentForm.java        ← 新規作成
└── ProjectMemberForm.java  ← 新規作成
```

#### 例外層（3ファイル）
```
src/main/java/com/example/exception/
├── ResourceNotFoundException.java ← 新規作成
├── UnauthorizedException.java     ← 新規作成
└── GlobalExceptionHandler.java    ← 新規作成
```

#### ビュー層（8ファイル）
```
src/main/resources/templates/
├── project/
│   ├── list.html      ← 新規作成（プロジェクト一覧）
│   ├── detail.html    ← 新規作成（プロジェクト詳細）
│   ├── form.html      ← 新規作成（プロジェクト作成・編集）
│   └── members.html   ← 新規作成（メンバー管理）
└── task/
    ├── list.html      ← 既存（修正）
    ├── detail.html    ← 新規作成（タスク詳細）
    ├── form.html      ← 新規作成（タスク作成・編集）
    └── kanban.html    ← 新規作成（カンバンボード）
```

### 📝 修正対象ファイル（5ファイル）

```
src/main/java/com/example/
├── controller/
│   ├── ProjectController.java   ← 修正（現在空）
│   ├── TaskController.java      ← 修正（現在空）
│   ├── CommentController.java   ← 修正（現在空）
│   └── DashboardController.java ← 修正（統計情報追加）
├── config/
│   └── DataInitializer.java     ← 修正（初期データ追加）
└── resources/
    └── templates/
        └── dashboard.html       ← 修正（統計情報表示）
```

---

## データフロー

### 全体アーキテクチャ

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                                │
│                   (ユーザーインターフェース)                      │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP Request
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                   Controller Layer                            │
│  ・ProjectController  ・TaskController  ・CommentController   │
│  役割: リクエスト受付、入力検証、ビュー選択                          │
└────────────────────────┬─────────────────────────────────────┘
                         │ DTO/Form
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    Service Layer                              │
│  ・ProjectService  ・TaskService  ・CommentService            │
│  役割: ビジネスロジック、トランザクション管理                        │
└────────────────────────┬─────────────────────────────────────┘
                         │ Entity
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                  Repository Layer                             │
│  ・ProjectRepository  ・TaskRepository  ・CommentRepository   │
│  役割: データベースアクセス、CRUD操作                              │
└────────────────────────┬─────────────────────────────────────┘
                         │ SQL
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                     Database                                  │
│  projects / tasks / project_members / comments                │
└──────────────────────────────────────────────────────────────┘
```

### プロジェクト作成の処理フロー

```
[ブラウザ] 
    ↓ GET /projects/new
[ProjectController#newProject()]
    ↓ 空のフォームをModelに追加
[project/form.html]
    ↓ ユーザー入力
    ↓ POST /projects
[ProjectController#createProject(ProjectForm)]
    ↓ @Valid でバリデーション
    ↓ ProjectService#createProject(ProjectForm)
[ProjectService]
    ↓ Form → Entity 変換
    ↓ 現在のユーザーを作成者として設定
    ↓ ProjectRepository#save(Project)
[ProjectRepository]
    ↓ INSERT INTO projects ...
[Database]
    ↓ 保存完了、IDを返却
[ProjectService]
    ↓ Entity → DTO 変換
    ↓ return ProjectDto
[ProjectController]
    ↓ リダイレクト: /projects/{id}
[project/detail.html]
    ↓ プロジェクト詳細を表示
[ブラウザ]
```

### タスク一覧取得の処理フロー

```
[ブラウザ]
    ↓ GET /tasks?projectId=1&status=TODO&page=0
[TaskController#listTasks(projectId, status, page)]
    ↓ TaskService#findTasks(projectId, status, page)
[TaskService]
    ↓ TaskRepository#findByProjectIdAndStatus(projectId, status, page)
[TaskRepository]
    ↓ SELECT * FROM tasks WHERE project_id=? AND status=? ...
[Database]
    ↓ Page<Task> を返却
[TaskService]
    ↓ Entity → DTO 変換
    ↓ return Page<TaskDto>
[TaskController]
    ↓ Model に追加
    ↓ "task/list" を返却
[task/list.html]
    ↓ タスク一覧を表示
[ブラウザ]
```

### タスクステータス更新の処理フロー

```
[ブラウザ]
    ↓ PATCH /tasks/{id}/status (AJAX)
    ↓ Body: {"status": "IN_PROGRESS"}
[TaskController#updateTaskStatus(id, status)]
    ↓ TaskService#updateStatus(id, status)
[TaskService]
    ↓ TaskRepository#findById(id)
    ↓ task.setStatus(status)
    ↓ TaskRepository#save(task)
[TaskRepository]
    ↓ UPDATE tasks SET status=? WHERE id=?
[Database]
    ↓ 更新完了
[TaskService]
    ↓ return TaskDto
[TaskController]
    ↓ return ResponseEntity<TaskDto>
[ブラウザ]
    ↓ JavaScript でカード移動（カンバンボード）
```

---

## 実装順序

### フェーズ1: プロジェクト管理（基本機能）

#### ステップ1: エンティティとリポジトリ
```
1. Project.java を作成
2. ProjectRepository.java を作成
3. ProjectMember.java を作成
4. ProjectMemberRepository.java を作成
```

#### ステップ2: サービス層
```
5. ProjectDto.java を作成
6. ProjectForm.java を作成
7. ProjectService.java を作成
8. ProjectMemberService.java を作成
```

#### ステップ3: コントローラとビュー
```
9. ProjectController.java を実装
10. project/list.html を作成
11. project/form.html を作成
12. project/detail.html を作成
```

#### ステップ4: テスト
```
13. ブラウザでプロジェクト作成・一覧・詳細をテスト
```

---

### フェーズ2: タスク管理（基本機能）

#### ステップ5: エンティティとリポジトリ
```
14. Task.java を作成
15. TaskRepository.java を作成
```

#### ステップ6: サービス層
```
16. TaskDto.java を作成
17. TaskForm.java を作成
18. TaskService.java を作成
```

#### ステップ7: コントローラとビュー
```
19. TaskController.java を実装
20. task/list.html を修正
21. task/form.html を作成
22. task/detail.html を作成
```

#### ステップ8: テスト
```
23. ブラウザでタスク作成・一覧・詳細をテスト
```

---

### フェーズ3: コメント機能

#### ステップ9: エンティティとリポジトリ
```
24. Comment.java を作成
25. CommentRepository.java を作成
```

#### ステップ10: サービス層
```
26. CommentDto.java を作成
27. CommentForm.java を作成
28. CommentService.java を作成
```

#### ステップ11: コントローラとビュー
```
29. CommentController.java を実装
30. task/detail.html にコメント機能を追加
```

---

### フェーズ4: 高度な機能

#### ステップ12: カンバンボード
```
31. task/kanban.html を作成
32. AJAX でタスクのドラッグ&ドロップ実装
```

#### ステップ13: ダッシュボード統計
```
33. DashboardStatisticsDto.java を作成
34. DashboardController.java を修正
35. dashboard.html を修正（実際の統計表示）
```

#### ステップ14: 例外ハンドリング
```
36. ResourceNotFoundException.java を作成
37. UnauthorizedException.java を作成
38. GlobalExceptionHandler.java を作成
```

#### ステップ15: メンバー管理
```
39. project/members.html を作成
40. ProjectMemberForm.java を作成
41. プロジェクトメンバー追加・削除機能実装
```

---

## 各ファイルの詳細仕様

### 1. エンティティ層

#### Project.java
```java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProjectStatus status = ProjectStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectMember> members = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getter/Setter
}

enum ProjectStatus {
    ACTIVE, COMPLETED, ARCHIVED, ON_HOLD
}
```

#### Task.java
```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TaskStatus status = TaskStatus.TODO;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    private LocalDate deadline;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getter/Setter
}

enum TaskStatus {
    TODO, IN_PROGRESS, REVIEW, DONE
}

enum TaskPriority {
    LOW, MEDIUM, HIGH, URGENT
}
```

#### ProjectMember.java
```java
@Entity
@Table(name = "project_members", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "user_id"}))
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_project", length = 20)
    private ProjectRole roleInProject = ProjectRole.MEMBER;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }
    
    // Getter/Setter
}

enum ProjectRole {
    OWNER, MANAGER, MEMBER, VIEWER
}
```

#### Comment.java
```java
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getter/Setter
}
```

---

### 2. リポジトリ層

#### ProjectRepository.java
```java
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    // 作成者で検索
    List<Project> findByCreatedBy(User user);
    
    // ステータスで検索
    List<Project> findByStatus(ProjectStatus status);
    
    // メンバーが参加しているプロジェクトを検索
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user = :user")
    List<Project> findByMember(@Param("user") User user);
    
    // ユーザーが関わる全プロジェクト（作成者 or メンバー）
    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN p.members m " +
           "WHERE p.createdBy = :user OR m.user = :user")
    List<Project> findByUserInvolved(@Param("user") User user);
    
    // 名前で検索（部分一致）
    List<Project> findByNameContainingIgnoreCase(String name);
    
    // ステータス別カウント
    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countByStatus();
}
```

#### TaskRepository.java
```java
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // プロジェクトで検索
    List<Task> findByProject(Project project);
    
    // プロジェクトとステータスで検索
    List<Task> findByProjectAndStatus(Project project, TaskStatus status);
    
    // 担当者で検索
    List<Task> findByAssignedUser(User user);
    
    // 担当者とステータスで検索
    List<Task> findByAssignedUserAndStatus(User user, TaskStatus status);
    
    // 期限が迫っているタスク
    @Query("SELECT t FROM Task t WHERE t.deadline BETWEEN :start AND :end " +
           "AND t.status != 'DONE'")
    List<Task> findUpcomingDeadlines(@Param("start") LocalDate start, 
                                      @Param("end") LocalDate end);
    
    // ステータス別カウント（プロジェクト別）
    @Query("SELECT t.status, COUNT(t) FROM Task t " +
           "WHERE t.project = :project GROUP BY t.status")
    List<Object[]> countByStatusInProject(@Param("project") Project project);
    
    // 優先度別カウント
    @Query("SELECT t.priority, COUNT(t) FROM Task t " +
           "WHERE t.project = :project GROUP BY t.priority")
    List<Object[]> countByPriorityInProject(@Param("project") Project project);
}
```

#### ProjectMemberRepository.java
```java
@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    
    // プロジェクトのメンバー一覧
    List<ProjectMember> findByProject(Project project);
    
    // ユーザーが参加しているプロジェクト
    List<ProjectMember> findByUser(User user);
    
    // プロジェクトとユーザーで検索
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
    
    // ユーザーがプロジェクトのメンバーか確認
    boolean existsByProjectAndUser(Project project, User user);
    
    // プロジェクト内のロール別メンバー検索
    List<ProjectMember> findByProjectAndRoleInProject(Project project, 
                                                        ProjectRole role);
    
    // プロジェクトとユーザーで削除
    void deleteByProjectAndUser(Project project, User user);
}
```

#### CommentRepository.java
```java
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // タスクのコメント一覧（作成日時順）
    List<Comment> findByTaskOrderByCreatedAtDesc(Task task);
    
    // ユーザーのコメント一覧
    List<Comment> findByUser(User user);
    
    // タスクのコメント数
    long countByTask(Task task);
    
    // 最近のコメント（全体）
    @Query("SELECT c FROM Comment c ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments(Pageable pageable);
}
```

---

### 3. サービス層

#### ProjectService.java
```java
@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ProjectMemberRepository memberRepository;
    
    @Autowired
    private UserService userService;
    
    /**
     * プロジェクト作成
     */
    public ProjectDto createProject(ProjectForm form, String username) {
        User currentUser = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Project project = new Project();
        project.setName(form.getName());
        project.setDescription(form.getDescription());
        project.setStartDate(form.getStartDate());
        project.setEndDate(form.getEndDate());
        project.setCreatedBy(currentUser);
        project.setStatus(ProjectStatus.ACTIVE);
        
        Project saved = projectRepository.save(project);
        
        // 作成者を自動的にOWNERとして追加
        ProjectMember owner = new ProjectMember();
        owner.setProject(saved);
        owner.setUser(currentUser);
        owner.setRoleInProject(ProjectRole.OWNER);
        memberRepository.save(owner);
        
        return convertToDto(saved);
    }
    
    /**
     * ユーザーが関わるプロジェクト一覧
     */
    @Transactional(readOnly = true)
    public List<ProjectDto> findUserProjects(String username) {
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<Project> projects = projectRepository.findByUserInvolved(user);
        return projects.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * プロジェクト詳細取得
     */
    @Transactional(readOnly = true)
    public ProjectDetailDto findById(Long id, String username) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        
        // アクセス権限チェック
        checkAccess(project, username);
        
        return convertToDetailDto(project);
    }
    
    /**
     * プロジェクト更新
     */
    public ProjectDto updateProject(Long id, ProjectForm form, String username) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        
        // 編集権限チェック（OWNERまたはMANAGER）
        checkEditPermission(project, username);
        
        project.setName(form.getName());
        project.setDescription(form.getDescription());
        project.setStartDate(form.getStartDate());
        project.setEndDate(form.getEndDate());
        
        Project updated = projectRepository.save(project);
        return convertToDto(updated);
    }
    
    /**
     * プロジェクト削除
     */
    public void deleteProject(Long id, String username) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        
        // 削除権限チェック（OWNERのみ）
        checkOwnerPermission(project, username);
        
        projectRepository.delete(project);
    }
    
    // 権限チェック系メソッド
    private void checkAccess(Project project, String username) {
        // 実装
    }
    
    private void checkEditPermission(Project project, String username) {
        // 実装
    }
    
    private void checkOwnerPermission(Project project, String username) {
        // 実装
    }
    
    // 変換メソッド
    private ProjectDto convertToDto(Project project) {
        // Entity → DTO 変換
    }
    
    private ProjectDetailDto convertToDetailDto(Project project) {
        // Entity → DetailDTO 変換（関連データも含む）
    }
}
```

#### TaskService.java
```java
@Service
@Transactional
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserService userService;
    
    /**
     * タスク作成
     */
    public TaskDto createTask(TaskForm form, String username) {
        User currentUser = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Project project = projectRepository.findById(form.getProjectId())
            .orElseThrow(() -> new ResourceNotFoundException("Project", form.getProjectId()));
        
        Task task = new Task();
        task.setProject(project);
        task.setTitle(form.getTitle());
        task.setDescription(form.getDescription());
        task.setStatus(TaskStatus.TODO);
        task.setPriority(form.getPriority());
        task.setDeadline(form.getDeadline());
        task.setCreatedBy(currentUser);
        
        if (form.getAssignedUserId() != null) {
            User assignedUser = userService.findById(form.getAssignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", form.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        }
        
        Task saved = taskRepository.save(task);
        return convertToDto(saved);
    }
    
    /**
     * タスク一覧取得（フィルタリング付き）
     */
    @Transactional(readOnly = true)
    public Page<TaskDto> findTasks(Long projectId, TaskStatus status, 
                                     int page, int size) {
        // 実装
    }
    
    /**
     * タスクステータス更新
     */
    public TaskDto updateStatus(Long id, TaskStatus status, String username) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return convertToDto(updated);
    }
    
    /**
     * 担当者変更
     */
    public TaskDto assignUser(Long taskId, Long userId) {
        // 実装
    }
    
    // 変換メソッド
    private TaskDto convertToDto(Task task) {
        // Entity → DTO 変換
    }
}
```

---

### 4. コントローラ層

#### ProjectController.java
```java
@Controller
@RequestMapping("/projects")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * プロジェクト一覧
     */
    @GetMapping
    public String listProjects(Authentication auth, Model model) {
        String username = auth.getName();
        List<ProjectDto> projects = projectService.findUserProjects(username);
        model.addAttribute("projects", projects);
        return "project/list";
    }
    
    /**
     * プロジェクト作成画面
     */
    @GetMapping("/new")
    public String newProject(Model model) {
        model.addAttribute("projectForm", new ProjectForm());
        return "project/form";
    }
    
    /**
     * プロジェクト作成処理
     */
    @PostMapping
    public String createProject(@Valid @ModelAttribute ProjectForm form,
                                 BindingResult result,
                                 Authentication auth,
                                 RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "project/form";
        }
        
        ProjectDto project = projectService.createProject(form, auth.getName());
        redirectAttributes.addFlashAttribute("message", 
            "プロジェクトを作成しました");
        return "redirect:/projects/" + project.getId();
    }
    
    /**
     * プロジェクト詳細
     */
    @GetMapping("/{id}")
    public String projectDetail(@PathVariable Long id,
                                 Authentication auth,
                                 Model model) {
        ProjectDetailDto project = projectService.findById(id, auth.getName());
        model.addAttribute("project", project);
        return "project/detail";
    }
    
    /**
     * プロジェクト編集画面
     */
    @GetMapping("/{id}/edit")
    public String editProject(@PathVariable Long id,
                               Authentication auth,
                               Model model) {
        ProjectDetailDto project = projectService.findById(id, auth.getName());
        model.addAttribute("projectForm", convertToForm(project));
        model.addAttribute("projectId", id);
        return "project/form";
    }
    
    /**
     * プロジェクト更新処理
     */
    @PutMapping("/{id}")
    public String updateProject(@PathVariable Long id,
                                 @Valid @ModelAttribute ProjectForm form,
                                 BindingResult result,
                                 Authentication auth,
                                 RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "project/form";
        }
        
        projectService.updateProject(id, form, auth.getName());
        redirectAttributes.addFlashAttribute("message", 
            "プロジェクトを更新しました");
        return "redirect:/projects/" + id;
    }
    
    /**
     * プロジェクト削除
     */
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id,
                                 Authentication auth,
                                 RedirectAttributes redirectAttributes) {
        projectService.deleteProject(id, auth.getName());
        redirectAttributes.addFlashAttribute("message", 
            "プロジェクトを削除しました");
        return "redirect:/projects";
    }
}
```

#### TaskController.java
```java
@Controller
@RequestMapping("/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    /**
     * タスク一覧（リスト表示）
     */
    @GetMapping
    public String listTasks(@RequestParam(required = false) Long projectId,
                             @RequestParam(required = false) TaskStatus status,
                             @RequestParam(defaultValue = "0") int page,
                             Model model) {
        Page<TaskDto> tasks = taskService.findTasks(projectId, status, page, 20);
        model.addAttribute("tasks", tasks);
        return "task/list";
    }
    
    /**
     * カンバンボード表示
     */
    @GetMapping("/kanban")
    public String kanbanBoard(@RequestParam Long projectId, Model model) {
        Map<TaskStatus, List<TaskDto>> tasksByStatus = 
            taskService.findTasksByProject(projectId);
        model.addAttribute("tasksByStatus", tasksByStatus);
        return "task/kanban";
    }
    
    /**
     * タスク作成画面
     */
    @GetMapping("/new")
    public String newTask(@RequestParam Long projectId, Model model) {
        model.addAttribute("taskForm", new TaskForm());
        model.addAttribute("projectId", projectId);
        return "task/form";
    }
    
    /**
     * タスク作成処理
     */
    @PostMapping
    public String createTask(@Valid @ModelAttribute TaskForm form,
                              BindingResult result,
                              Authentication auth) {
        if (result.hasErrors()) {
            return "task/form";
        }
        
        TaskDto task = taskService.createTask(form, auth.getName());
        return "redirect:/tasks/" + task.getId();
    }
    
    /**
     * タスク詳細
     */
    @GetMapping("/{id}")
    public String taskDetail(@PathVariable Long id, Model model) {
        TaskDetailDto task = taskService.findByIdWithComments(id);
        model.addAttribute("task", task);
        model.addAttribute("commentForm", new CommentForm());
        return "task/detail";
    }
    
    /**
     * タスクステータス更新（AJAX）
     */
    @PatchMapping("/{id}/status")
    @ResponseBody
    public ResponseEntity<TaskDto> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        TaskStatus status = TaskStatus.valueOf(request.get("status"));
        TaskDto updated = taskService.updateStatus(id, status, auth.getName());
        return ResponseEntity.ok(updated);
    }
}
```

---

## 画面遷移フロー

### メイン遷移

```
ログイン画面
    ↓
ダッシュボード
    ├─→ プロジェクト一覧 (/projects)
    │       ├─→ プロジェクト作成 (/projects/new)
    │       │       └─→ プロジェクト詳細 (/projects/{id})
    │       └─→ プロジェクト詳細 (/projects/{id})
    │               ├─→ プロジェクト編集 (/projects/{id}/edit)
    │               ├─→ メンバー管理 (/projects/{id}/members)
    │               └─→ タスク作成 (/tasks/new?projectId={id})
    │
    └─→ タスク一覧 (/tasks)
            ├─→ リスト表示 (/tasks)
            │       └─→ タスク詳細 (/tasks/{id})
            │               ├─→ タスク編集
            │               └─→ コメント追加
            │
            └─→ カンバンボード (/tasks/kanban?projectId={id})
                    └─→ ドラッグ&ドロップでステータス変更
```

---

**最終更新日**: 2025年10月13日

