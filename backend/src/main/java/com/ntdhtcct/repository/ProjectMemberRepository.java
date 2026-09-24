package com.ntdhtcct.repository;

import com.ntdhtcct.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    Optional<ProjectMember> findByProjectIdAndUserIdAndStatus(Long projectId, Long userId, String status);

    List<ProjectMember> findByProjectId(Long projectId);

    List<ProjectMember> findByUserId(Long userId);

    boolean existsByProjectIdAndUserIdAndStatus(Long projectId, Long userId, String status);

    void deleteByProjectIdAndUserId(Long projectId, Long userId);

    @Query("SELECT pm.role.code FROM ProjectMember pm " +
           "WHERE pm.project.id = :projectId AND pm.user.id = :userId AND pm.status = 'ACTIVE'")
    Optional<String> findActiveRoleCodeByProjectAndUser(@Param("projectId") Long projectId,
                                                        @Param("userId") Long userId);
}
