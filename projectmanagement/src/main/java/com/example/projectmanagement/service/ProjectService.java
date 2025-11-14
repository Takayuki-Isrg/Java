package com.example.projectmanagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.entity.Project.ProjectStatus;
import com.example.projectmanagement.entity.ProjectMember;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.ProjectMemberRepository;
import com.example.projectmanagement.repository.ProjectRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository memberRepository;
    
    @Autowired
    private UserService userService;

    @Autowired
    private ProjectMember projectMember;

    
    /**
     * プロジェクト作成
     * @param form プロジェクト情報
     * @param username ユーザー名
     * @return 作成されたプロジェクト
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
        projectMember.setProject(saved);
        projectMember.setUser(currentUser);
        projectMember.setRoleInProject(ProjectRole.OWNER);
        projectMember.setProject(saved);
        memberRepository.save(projectMember);
        
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

    checkOwnerPermission(project, username);
    
    projectRepository.delete(project);
    }


    // 権限チェック系メソッド
    private void checkAccess(Project project, String username) {
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 作成者またはメンバーかチェック
        boolean isCreator = project.getCreatedBy().equals(user);
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);

        if (!isCreator && !isMember) {
            throw new UnauthorizedException("このプロジェクトへのアクセス権限がありません");
        }
    }

    private void checkEditPermission(Project project, String username) {
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // OWNERまたはMANAGERかチェック
        boolean isOwner = project.getCreatedBy().equals(user);
        Optional<ProjectMember> member = projectMemberRepository.findByProjectAndUser(project, user);
        
        boolean isManager = member.isPresent() && member.get().getRoleInProject() == ProjectRole.MANAGER;
        if (!isOwner && !isManager) {
            throw new UnauthorizedException("このプロジェクトの編集権限がありません");
        }
    }

    private void checkOwnerPermission(Project project, String username) {
        User user = userService.findByUsername(username);
        if (!user.equals(project.getCreatedBy())) {
            throw new UnauthorizedException("このプロジェクトの削除権限がありません");
        }
    }

    // 変換メソッド
    private ProjectDto convertToDto(Project project) {
        return new ProjectDto(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getStartDate(),
            project.getEndDate(),
            project.getStatus(),
            project.getCreatedBy().getUsername()
        );
    }

    private ProjectDetailDto convertToDetailDto(Project project) {
        return new ProjectDetailDto(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getStartDate(),
            project.getEndDate(),
            project.getStatus(),
            project.getCreatedBy().getUsername()
        );
    }
}
