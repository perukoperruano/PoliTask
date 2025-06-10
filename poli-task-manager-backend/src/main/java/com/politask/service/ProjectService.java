package com.politask.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.politask.entity.Project;
import com.politask.repository.ProjectRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project) {
        try {
            return projectRepository.save(project);
        } catch (Exception e) {
            e.printStackTrace(); // Esto mostrará la causa real en la consola
            throw new RuntimeException("Error al crear el proyecto: " + e.getMessage());
        }
    }

    public Project updateProject(Project project) {
        try {
            return projectRepository.save(project);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el proyecto: " + e.getMessage());
        }
    }

    public boolean deleteProject(Long id) {
        try {
            if (projectRepository.existsById(id)) {
                projectRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al eliminar el proyecto: " + e.getMessage());
        }
    }

    // Método alternativo para eliminación suave (recomendado)
    public Project softDeleteProject(Long id) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            // Aquí podrías agregar un campo 'active' o 'deleted' a la entidad Project
            // project.setActive(false);
            return projectRepository.save(project);
        }
        throw new RuntimeException("Proyecto no encontrado");
    }
}