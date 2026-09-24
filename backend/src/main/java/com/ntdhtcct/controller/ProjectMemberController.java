package com.ntdhtcct.controller;

import com.ntdhtcct.auth.annotation.RequireProjectRole;
import com.ntdhtcct.common.response.ApiResponse;
import com.ntdhtcct.dto.AddMemberRequest;
import com.ntdhtcct.dto.ProjectMemberResponse;
import com.ntdhtcct.dto.UpdateMemberRoleRequest;
import com.ntdhtcct.service.ProjectMemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * T-04.4: Controller xử lý thêm thành viên, gán vai trò và quản lý thành viên dự án.
 * T-04.8: Cấu hình quyền truy cập theo từng Route bằng Annotation @RequireProjectRole.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    public ProjectMemberController(ProjectMemberService projectMemberService) {
        this.projectMemberService = projectMemberService;
    }

    /**
     * T-04.4 & T-04.8: Gán Role cho User và thêm vào Project (Yêu cầu ADMIN hoặc PROJECT_MANAGER).
     */
    @PostMapping
    @RequireProjectRole({"ADMIN", "PROJECT_MANAGER"})
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddMemberRequest request) {

        ProjectMemberResponse response = projectMemberService.addMemberToProject(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gán vai trò và thêm thành viên vào dự án thành công", response));
    }

    /**
     * T-04.4 & T-04.8: Cập nhật Role của User trong Project (Yêu cầu ADMIN hoặc PROJECT_MANAGER).
     */
    @PutMapping("/{userId}/role")
    @RequireProjectRole({"ADMIN", "PROJECT_MANAGER"})
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {

        ProjectMemberResponse response = projectMemberService.updateMemberRole(projectId, userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật vai trò thành viên thành công", response));
    }

    /**
     * T-04.4 & T-04.8: Xóa thành viên khỏi Project (Yêu cầu ADMIN hoặc PROJECT_MANAGER).
     */
    @DeleteMapping("/{userId}")
    @RequireProjectRole({"ADMIN", "PROJECT_MANAGER"})
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {

        projectMemberService.removeMemberFromProject(projectId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Xóa thành viên khỏi dự án thành công", null));
    }

    /**
     * T-04.8: Lấy danh sách thành viên của Project (ADMIN, PROJECT_MANAGER, SITE_ENGINEER, VIEWER).
     */
    @GetMapping
    @RequireProjectRole({"ADMIN", "PROJECT_MANAGER", "SITE_ENGINEER", "VIEWER"})
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(
            @PathVariable Long projectId) {

        List<ProjectMemberResponse> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(ApiResponse.ok(members));
    }

    /**
     * T-04.8: Xem chi tiết vai trò của 1 thành viên trong Project.
     */
    @GetMapping("/{userId}")
    @RequireProjectRole({"ADMIN", "PROJECT_MANAGER", "SITE_ENGINEER", "VIEWER"})
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> getProjectMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {

        ProjectMemberResponse member = projectMemberService.getProjectMember(projectId, userId);
        return ResponseEntity.ok(ApiResponse.ok(member));
    }
}
