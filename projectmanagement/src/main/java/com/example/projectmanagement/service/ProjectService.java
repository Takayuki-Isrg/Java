package com.example.projectmanagement.service;

import com.example.projectmanagement.entity.Project;
import com.example.projectmanagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project save(Project project) {
        return projectRepository.save(project);
    }
    
    public List<Project> findAll() {
        return projectRepository.findAll();
    }
    
    public Project findById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }
    
    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }
}
