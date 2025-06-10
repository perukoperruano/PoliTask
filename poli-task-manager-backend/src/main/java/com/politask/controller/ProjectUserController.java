package com.politask.controller;

import com.politask.entity.ProjectUser;
import com.politask.repository.ProjectUserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-users")
@CrossOrigin(origins = "*")
public class ProjectUserController {

    private final ProjectUserRepository projectUserRepository;

    public ProjectUserController(ProjectUserRepository projectUserRepository) {
        this.projectUserRepository = projectUserRepository;
    }

    @GetMapping("/{projectId}")
    public List<ProjectUser> getByProject(@PathVariable Long projectId) {
        return projectUserRepository.findByProjectId(projectId);
    }
}