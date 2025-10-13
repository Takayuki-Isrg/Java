# クイックリファレンス - プロジェクト/タスク管理機能実装

## 📚 実装時の必須チェックリスト

### ✅ エンティティ作成時のチェックポイント

- [ ] `@Entity` アノテーション付与
- [ ] `@Table(name = "テーブル名")` 指定
- [ ] 主キー（`@Id`, `@GeneratedValue`）定義
- [ ] バリデーション（`@NotBlank`, `@Size`など）追加
- [ ] リレーションシップ（`@ManyToOne`, `@OneToMany`など）定義
- [ ] `fetch = FetchType.LAZY` 設定（パフォーマンス対策）
- [ ] `@PrePersist`, `@PreUpdate` でタイムスタンプ自動設定
- [ ] Getter/Setter 実装
- [ ] デフォルトコンストラクタ追加

### ✅ リポジトリ作成時のチェックポイント

- [ ] `JpaRepository<Entity, Long>` を継承
- [ ] `@Repository` アノテーション付与
- [ ] 必要なクエリメソッドを定義
- [ ] 複雑なクエリは `@Query` で実装
- [ ] ページネーション対応（`Pageable` 引数）

### ✅ サービス作成時のチェックポイント

- [ ] `@Service` アノテーション付与
- [ ] `@Transactional` でトランザクション管理
- [ ] 読み取り専用は `@Transactional(readOnly = true)`
- [ ] 例外ハンドリング（ResourceNotFoundException など）
- [ ] 権限チェック（アクセス制御）
- [ ] Entity ⇔ DTO 変換メソッド
- [ ] JavaDoc コメント記述

### ✅ コントローラ作成時のチェックポイント

- [ ] `@Controller` または `@RestController` 付与
- [ ] `@RequestMapping` でベースURL設定
- [ ] 入力検証（`@Valid`, `BindingResult`）
- [ ] 認証情報取得（`Authentication` 引数）
- [ ] リダイレクト時は `RedirectAttributes` でメッセージ
- [ ] 例外ハンドリング
- [ ] CSRF トークン確認（POST/PUT/DELETE）

### ✅ テンプレート作成時のチェックポイント

- [ ] Thymeleaf 名前空間宣言
- [ ] Bootstrap 5 CDN 読み込み
- [ ] CSRF トークン埋め込み（フォーム）
- [ ] バリデーションエラー表示
- [ ] 成功/エラーメッセージ表示
- [ ] レスポンシブデザイン対応

---

## 🔧 コードテンプレート集

### 1. エンティティのテンプレート

```java
package com.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "テーブル名")
public class EntityName {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "項目名は必須です")
    @Size(max = 100, message = "項目名は100文字以内で入力してください")
    private String fieldName;
    
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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ...他のGetter/Setter
}
```

### 2. リポジトリのテンプレート

```java
package com.example.repository;

import com.example.entity.EntityName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EntityNameRepository extends JpaRepository<EntityName, Long> {
    
    // 単純な検索
    List<EntityName> findByFieldName(String fieldName);
    
    // 複雑なクエリ
    @Query("SELECT e FROM EntityName e WHERE e.field = :value")
    List<EntityName> findByCustomQuery(@Param("value") String value);
    
    // 存在チェック
    boolean existsByFieldName(String fieldName);
}
```

### 3. DTOのテンプレート

```java
package com.example.dto;

import java.time.LocalDateTime;

public class EntityNameDto {
    
    private Long id;
    private String fieldName;
    private LocalDateTime createdAt;
    
    // コンストラクタ
    public EntityNameDto() {}
    
    public EntityNameDto(Long id, String fieldName, LocalDateTime createdAt) {
        this.id = id;
        this.fieldName = fieldName;
        this.createdAt = createdAt;
    }
    
    // Getter/Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ...
}
```

### 4. フォームのテンプレート

```java
package com.example.form;

import jakarta.validation.constraints.*;

public class EntityNameForm {
    
    @NotBlank(message = "項目名は必須です")
    @Size(min = 3, max = 100, message = "項目名は3〜100文字で入力してください")
    private String fieldName;
    
    // Getter/Setter
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
}
```

### 5. サービスのテンプレート

```java
package com.example.service;

import com.example.entity.EntityName;
import com.example.repository.EntityNameRepository;
import com.example.dto.EntityNameDto;
import com.example.form.EntityNameForm;
import com.example.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EntityNameService {
    
    @Autowired
    private EntityNameRepository repository;
    
    /**
     * 作成
     */
    public EntityNameDto create(EntityNameForm form) {
        EntityName entity = new EntityName();
        entity.setFieldName(form.getFieldName());
        
        EntityName saved = repository.save(entity);
        return convertToDto(saved);
    }
    
    /**
     * 全件取得
     */
    @Transactional(readOnly = true)
    public List<EntityNameDto> findAll() {
        return repository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * ID検索
     */
    @Transactional(readOnly = true)
    public EntityNameDto findById(Long id) {
        EntityName entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("EntityName", id));
        return convertToDto(entity);
    }
    
    /**
     * 更新
     */
    public EntityNameDto update(Long id, EntityNameForm form) {
        EntityName entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("EntityName", id));
        
        entity.setFieldName(form.getFieldName());
        EntityName updated = repository.save(entity);
        return convertToDto(updated);
    }
    
    /**
     * 削除
     */
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("EntityName", id);
        }
        repository.deleteById(id);
    }
    
    /**
     * Entity → DTO 変換
     */
    private EntityNameDto convertToDto(EntityName entity) {
        EntityNameDto dto = new EntityNameDto();
        dto.setId(entity.getId());
        dto.setFieldName(entity.getFieldName());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
```

### 6. コントローラのテンプレート

```java
package com.example.controller;

import com.example.service.EntityNameService;
import com.example.dto.EntityNameDto;
import com.example.form.EntityNameForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/entities")
public class EntityNameController {
    
    @Autowired
    private EntityNameService service;
    
    /**
     * 一覧表示
     */
    @GetMapping
    public String list(Model model) {
        List<EntityNameDto> entities = service.findAll();
        model.addAttribute("entities", entities);
        return "entity/list";
    }
    
    /**
     * 作成画面
     */
    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("form", new EntityNameForm());
        return "entity/form";
    }
    
    /**
     * 作成処理
     */
    @PostMapping
    public String create(@Valid @ModelAttribute("form") EntityNameForm form,
                         BindingResult result,
                         RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "entity/form";
        }
        
        EntityNameDto created = service.create(form);
        redirectAttributes.addFlashAttribute("successMessage", "作成しました");
        return "redirect:/entities/" + created.getId();
    }
    
    /**
     * 詳細表示
     */
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        EntityNameDto entity = service.findById(id);
        model.addAttribute("entity", entity);
        return "entity/detail";
    }
    
    /**
     * 編集画面
     */
    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        EntityNameDto entity = service.findById(id);
        // DTO → Form 変換
        EntityNameForm form = new EntityNameForm();
        form.setFieldName(entity.getFieldName());
        
        model.addAttribute("form", form);
        model.addAttribute("id", id);
        return "entity/form";
    }
    
    /**
     * 更新処理
     */
    @PutMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("form") EntityNameForm form,
                         BindingResult result,
                         RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "entity/form";
        }
        
        service.update(id, form);
        redirectAttributes.addFlashAttribute("successMessage", "更新しました");
        return "redirect:/entities/" + id;
    }
    
    /**
     * 削除処理
     */
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id,
                         RedirectAttributes redirectAttributes) {
        service.delete(id);
        redirectAttributes.addFlashAttribute("successMessage", "削除しました");
        return "redirect:/entities";
    }
}
```

### 7. Thymeleafテンプレート（一覧画面）

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>一覧 - プロジェクト管理</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <!-- ナビゲーションバー -->
    <nav th:replace="~{layout/navbar :: navbar}"></nav>
    
    <div class="container mt-4">
        <!-- 成功メッセージ -->
        <div th:if="${successMessage}" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill"></i>
            <span th:text="${successMessage}"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        
        <!-- ヘッダー -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2><i class="bi bi-list-ul"></i> 一覧</h2>
            <a th:href="@{/entities/new}" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> 新規作成
            </a>
        </div>
        
        <!-- テーブル -->
        <div class="card">
            <div class="card-body">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>項目名</th>
                            <th>作成日時</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="entity : ${entities}">
                            <td th:text="${entity.id}"></td>
                            <td th:text="${entity.fieldName}"></td>
                            <td th:text="${#temporals.format(entity.createdAt, 'yyyy/MM/dd HH:mm')}"></td>
                            <td>
                                <a th:href="@{/entities/{id}(id=${entity.id})}" class="btn btn-sm btn-info">
                                    <i class="bi bi-eye"></i> 詳細
                                </a>
                                <a th:href="@{/entities/{id}/edit(id=${entity.id})}" class="btn btn-sm btn-warning">
                                    <i class="bi bi-pencil"></i> 編集
                                </a>
                            </td>
                        </tr>
                        <tr th:if="${#lists.isEmpty(entities)}">
                            <td colspan="4" class="text-center text-muted">データがありません</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### 8. Thymeleafテンプレート（フォーム画面）

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title th:text="${id != null ? '編集' : '新規作成'} + ' - プロジェクト管理'"></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h2 th:text="${id != null ? '編集' : '新規作成'}"></h2>
        
        <form th:action="${id != null ? '/entities/' + id : '/entities'}" 
              th:method="${id != null ? 'put' : 'post'}" 
              th:object="${form}">
            
            <!-- CSRFトークン -->
            <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
            
            <!-- 項目名 -->
            <div class="mb-3">
                <label for="fieldName" class="form-label">項目名</label>
                <input type="text" class="form-control" id="fieldName" 
                       th:field="*{fieldName}"
                       th:classappend="${#fields.hasErrors('fieldName')} ? 'is-invalid' : ''">
                <div class="invalid-feedback" th:if="${#fields.hasErrors('fieldName')}" 
                     th:errors="*{fieldName}"></div>
            </div>
            
            <!-- ボタン -->
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> 
                    <span th:text="${id != null ? '更新' : '作成'}"></span>
                </button>
                <a th:href="@{/entities}" class="btn btn-secondary">
                    <i class="bi bi-x-circle"></i> キャンセル
                </a>
            </div>
        </form>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## 🎯 Enum定義

### TaskStatus（タスクステータス）
```java
public enum TaskStatus {
    TODO("未着手"),
    IN_PROGRESS("進行中"),
    REVIEW("レビュー中"),
    DONE("完了");
    
    private final String displayName;
    
    TaskStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

### TaskPriority（タスク優先度）
```java
public enum TaskPriority {
    LOW("低"),
    MEDIUM("中"),
    HIGH("高"),
    URGENT("緊急");
    
    private final String displayName;
    
    TaskPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

### ProjectStatus（プロジェクトステータス）
```java
public enum ProjectStatus {
    ACTIVE("進行中"),
    COMPLETED("完了"),
    ARCHIVED("アーカイブ"),
    ON_HOLD("保留中");
    
    private final String displayName;
    
    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

### ProjectRole（プロジェクト内ロール）
```java
public enum ProjectRole {
    OWNER("オーナー"),
    MANAGER("マネージャー"),
    MEMBER("メンバー"),
    VIEWER("閲覧者");
    
    private final String displayName;
    
    ProjectRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

---

## 🔐 権限チェックのパターン

### プロジェクトアクセス権限チェック
```java
private void checkProjectAccess(Project project, String username) {
    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    // 作成者またはメンバーかチェック
    boolean isCreator = project.getCreatedBy().equals(user);
    boolean isMember = projectMemberRepository
        .existsByProjectAndUser(project, user);
    
    if (!isCreator && !isMember) {
        throw new UnauthorizedException(
            "このプロジェクトへのアクセス権限がありません");
    }
}
```

### プロジェクト編集権限チェック
```java
private void checkEditPermission(Project project, String username) {
    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    // OWNERまたはMANAGERかチェック
    boolean isOwner = project.getCreatedBy().equals(user);
    
    Optional<ProjectMember> member = projectMemberRepository
        .findByProjectAndUser(project, user);
    
    boolean isManager = member.isPresent() && 
        member.get().getRoleInProject() == ProjectRole.MANAGER;
    
    if (!isOwner && !isManager) {
        throw new UnauthorizedException(
            "このプロジェクトの編集権限がありません");
    }
}
```

---

## 📊 統計情報の取得パターン

### ダッシュボード統計
```java
public DashboardStatisticsDto getStatistics(String username) {
    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    // プロジェクト数
    long totalProjects = projectRepository.countByUserInvolved(user);
    
    // タスク数
    long totalTasks = taskRepository.countByAssignedUser(user);
    long completedTasks = taskRepository.countByAssignedUserAndStatus(
        user, TaskStatus.DONE);
    long pendingTasks = totalTasks - completedTasks;
    
    return new DashboardStatisticsDto(
        totalProjects, totalTasks, completedTasks, pendingTasks);
}
```

### プロジェクト統計
```java
public ProjectStatisticsDto getProjectStatistics(Long projectId) {
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
    
    Map<TaskStatus, Long> tasksByStatus = taskRepository
        .countByStatusInProject(project).stream()
        .collect(Collectors.toMap(
            arr -> (TaskStatus) arr[0],
            arr -> (Long) arr[1]
        ));
    
    return new ProjectStatisticsDto(
        project.getId(),
        tasksByStatus.getOrDefault(TaskStatus.TODO, 0L),
        tasksByStatus.getOrDefault(TaskStatus.IN_PROGRESS, 0L),
        tasksByStatus.getOrDefault(TaskStatus.DONE, 0L)
    );
}
```

---

## 🚀 よく使うMavenコマンド

```bash
# コンパイル
mvn compile

# テスト実行
mvn test

# パッケージング（JARファイル作成）
mvn package

# 起動（開発環境）
mvn spring-boot:run

# 起動（本番環境）
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# クリーンビルド
mvn clean install

# 依存関係の更新
mvn dependency:resolve

# キャッシュクリア
mvn clean
```

---

## 🐛 デバッグTips

### ログレベル調整
```properties
# application.properties
logging.level.com.example=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### SQLログ整形
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### H2コンソールで確認
```
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (空白)
```

---

**最終更新日**: 2025年10月13日

