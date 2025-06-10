package com.politask.repository;

import com.politask.entity.ProjectUser;
import com.politask.entity.ProjectUserId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, ProjectUserId> {
    List<ProjectUser> findByProjectId(Long projectId);
}