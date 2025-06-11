package com.politask.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.politask.dto.CreateProjectRequest;
import com.politask.entity.Project;
import com.politask.entity.User;
import com.politask.repository.UserRepository;
import com.politask.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    private final ProjectService projectService;
    private final UserRepository userRepository;
    
    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            List<Project> projects = projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        try {
            Optional<Project> project = projectService.getProjectById(id);
            if (project.isPresent()) {
                return ResponseEntity.ok(project.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Proyecto no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
public ResponseEntity<?> createProject(@Valid @RequestBody CreateProjectRequest request, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        Map<String, String> errors = new HashMap<>();
        bindingResult.getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }

    try {
        // Obtener el email del usuario autenticado desde el JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Buscar al usuario por email
        Optional<User> ownerOpt = userRepository.findByEmail(email);
        if (!ownerOpt.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Usuario no autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Crear proyecto
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(ownerOpt.get());

        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);

    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Error al crear el proyecto");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @Valid @RequestBody CreateProjectRequest request, BindingResult bindingResult) {
        // Validar errores de validación
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            // Verificar que el proyecto existe
            Optional<Project> projectOpt = projectService.getProjectById(id);
            if (!projectOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Proyecto no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Verificar que el nuevo owner existe (si se especifica)
            if (request.getOwnerId() != null) {
                Optional<User> ownerOpt = userRepository.findById(request.getOwnerId());
                if (!ownerOpt.isPresent()) {
                    Map<String, String> error = new HashMap<>();
                    error.put("ownerId", "Usuario no encontrado");
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Actualizar proyecto
            Project project = projectOpt.get();
            
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                project.setName(request.getName());
            }
            
            if (request.getDescription() != null) {
                project.setDescription(request.getDescription());
            }
            
            if (request.getOwnerId() != null) {
                User newOwner = userRepository.findById(request.getOwnerId()).get();
                project.setOwner(newOwner);
            }
            
            project.setUpdatedAt(LocalDateTime.now());

            Project updatedProject = projectService.updateProject(project);
            return ResponseEntity.ok(updatedProject);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error al actualizar el proyecto");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            // Verificar que el proyecto existe
            Optional<Project> projectOpt = projectService.getProjectById(id);
            if (!projectOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Proyecto no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // En lugar de eliminar, podrías marcar como inactivo
            // Por ahora haremos eliminación suave agregando un campo "active"
            boolean deleted = projectService.deleteProject(id);
            
            if (deleted) {
                Map<String, String> success = new HashMap<>();
                success.put("message", "Proyecto eliminado exitosamente");
                return ResponseEntity.ok(success);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "No se pudo eliminar el proyecto");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            }

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error al eliminar el proyecto");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}