package com.ntdhtcct.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * T-04.4: DTO cập nhật vai trò của thành viên trong dự án.
 */
public class UpdateMemberRoleRequest {

    @NotBlank(message = "Mã vai trò mới (newRoleCode) không được để trống")
    private String newRoleCode;

    public UpdateMemberRoleRequest() {
    }

    public UpdateMemberRoleRequest(String newRoleCode) {
        this.newRoleCode = newRoleCode;
    }

    public String getNewRoleCode() {
        return newRoleCode;
    }

    public void setNewRoleCode(String newRoleCode) {
        this.newRoleCode = newRoleCode;
    }
}
