package com.ntdhtcct.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.OffsetDateTime;
import java.util.Objects;

/**
 * T-04.2 & T-04.3: Entity ánh xạ bảng `project_members`.
 * Liên kết User với Project kèm Role tương ứng trong phạm vi dự án.
 */
@Entity
@Table(
        name = "project_members",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_project_member_project_user",
                columnNames = {"project_id", "user_id"}))
public class ProjectMember {

    /** Maximum length of the membership status column. */
    private static final int STATUS_MAX_LENGTH = 20;

    /** Database identifier for this project membership. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Project associated with this membership. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    /** User associated with this membership. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Role granted to the user in this project. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /** Current status of the project membership. */
    @Column(name = "status", nullable = false, length = STATUS_MAX_LENGTH)
    private String status = "ACTIVE";

    /** Timestamp when the user joined the project. */
    @Column(name = "joined_at", nullable = false)
    private OffsetDateTime joinedAt;

    /** Timestamp when this membership was created. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    /** Timestamp when this membership was last updated. */
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    /** Creates an empty membership for persistence. */
    public ProjectMember() {
    }

    /**
     * Creates a membership for the supplied project, user, and role.
     *
     * @param projectValue project associated with the membership
     * @param memberUser user associated with the membership
     * @param memberRole role granted in the project
     */
    public ProjectMember(
            final Project projectValue,
            final User memberUser,
            final Role memberRole) {
        this.project = projectValue;
        this.user = memberUser;
        this.role = memberRole;
        this.status = "ACTIVE";
    }

    /**
     * Initializes timestamps before persistence.
     *
        * @implSpec Preserves an existing join time and initializes creation and
        * update times.
     */
    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (this.joinedAt == null) {
            this.joinedAt = now;
        }
        this.createdAt = now;
        this.updatedAt = now;
    }

    /**
     * Updates the modification timestamp before persistence.
     *
     * @implSpec Sets the update time to the current time.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    /**
     * Returns this membership's database identifier.
     *
     * @return membership identifier, or {@code null} before persistence
     * @implSpec Returns the identifier assigned by persistence.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets this membership's database identifier.
     *
     * @param membershipId identifier to assign
     * @implSpec Replaces the identifier stored by this entity.
     */
    public void setId(final Long membershipId) {
        this.id = membershipId;
    }

    /**
     * Returns the associated project.
     *
     * @return associated project
     * @implSpec Returns the project reference stored by this entity.
     */
    public Project getProject() {
        return project;
    }

    /**
     * Sets the associated project.
     *
     * @param projectValue project to associate
     * @implSpec Replaces the project reference stored by this entity.
     */
    public void setProject(final Project projectValue) {
        this.project = projectValue;
    }

    /**
     * Returns the associated user.
     *
     * @return associated user
     * @implSpec Returns the user reference stored by this entity.
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the associated user.
     *
     * @param memberUser user to associate
     * @implSpec Replaces the user reference stored by this entity.
     */
    public void setUser(final User memberUser) {
        this.user = memberUser;
    }

    /**
     * Returns the role granted in the project.
     *
     * @return project role
     * @implSpec Returns the role reference stored by this entity.
     */
    public Role getRole() {
        return role;
    }

    /**
     * Sets the role granted in the project.
     *
     * @param memberRole role to assign
     * @implSpec Replaces the role reference stored by this entity.
     */
    public void setRole(final Role memberRole) {
        this.role = memberRole;
    }

    /**
     * Returns the membership status.
     *
     * @return membership status
     * @implSpec Returns the status stored by this entity.
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the membership status.
     *
     * @param membershipStatus status to assign
     * @implSpec Replaces the status stored by this entity.
     */
    public void setStatus(final String membershipStatus) {
        this.status = membershipStatus;
    }

    /**
     * Returns when the user joined the project.
     *
     * @return membership join timestamp
     * @implSpec Returns the join timestamp stored by this entity.
     */
    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    /**
     * Sets when the user joined the project.
     *
     * @param joinTimestamp timestamp to assign
     * @implSpec Replaces the join timestamp stored by this entity.
     */
    public void setJoinedAt(final OffsetDateTime joinTimestamp) {
        this.joinedAt = joinTimestamp;
    }

    /**
     * Returns when this membership was created.
     *
     * @return creation timestamp
     * @implSpec Returns the creation timestamp stored by this entity.
     */
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets when this membership was created.
     *
     * @param creationTimestamp timestamp to assign
     * @implSpec Replaces the creation timestamp stored by this entity.
     */
    public void setCreatedAt(final OffsetDateTime creationTimestamp) {
        this.createdAt = creationTimestamp;
    }

    /**
     * Returns when this membership was last updated.
     *
     * @return update timestamp
     * @implSpec Returns the update timestamp stored by this entity.
     */
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets when this membership was last updated.
     *
     * @param updateTimestamp timestamp to assign
     * @implSpec Replaces the update timestamp stored by this entity.
     */
    public void setUpdatedAt(final OffsetDateTime updateTimestamp) {
        this.updatedAt = updateTimestamp;
    }

    /**
     * Compares this membership to another object using its identifier.
     *
     * @param other object to compare
     * @return {@code true} when both memberships have the same identifier
     * @implSpec Equality is based only on the identifier.
     */
    @Override
    public boolean equals(final Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof ProjectMember that)) {
            return false;
        }
        return Objects.equals(id, that.id);
    }

    /**
     * Computes this membership's hash code from its identifier.
     *
     * @return hash code
     * @implSpec The hash code is based only on the identifier.
     */
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
