using System.Net;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class ProjectService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response<List<ProjectDto>>> GetAllProjectsAsync(Guid workspaceId)
    {
        var userId = accessor.GetUserId();

        var records = await db.Projects
            .Where(o => o.WorkspaceId == workspaceId &&
                        (db.WorkspaceMembers.Any(wm =>
                             wm.WorkspaceId == workspaceId && wm.UserId == userId &&
                             (wm.Role == EWorkspaceRole.Owner || wm.Role == EWorkspaceRole.Admin)) ||
                         db.ProjectMembers.Any(pm =>
                             pm.WorkspaceId == o.WorkspaceId && pm.ProjectId == o.Id && pm.UserId == userId)))
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new ProjectDto(
                o.Id,
                o.Name,
                o.Description,
                o.Status,
                o.Priority,
                o.DueDate,
                db.UserFavorites.Any(uf =>
                    uf.UserId == userId && uf.EntityType == EFavoriteEntityType.Project && uf.EntityId == o.Id),
                db.ProjectMembers
                    .Where(pm => pm.WorkspaceId == workspaceId && pm.ProjectId == o.Id)
                    .OrderBy(pm => pm.Role)
                    .ThenBy(pm => pm.User.FirstName)
                    .ThenBy(pm => pm.User.LastName)
                    .Select(pm => new ProjectMemberDto(pm.UserId, pm.User.FullName, pm.User.Email, pm.Role))
                    .ToList()
            ))
            .ToListAsync();

        return new Response<List<ProjectDto>>(records);
    }

    public async Task<Response<ProjectDto>> GetProjectByIdAsync(Guid workspaceId, Guid projectId)
    {
        var userId = accessor.GetUserId();

        var record = await db.Projects
            .Where(o => o.WorkspaceId == workspaceId && o.Id == projectId)
            .Select(o => new ProjectDto(
                o.Id,
                o.Name,
                o.Description,
                o.Status,
                o.Priority,
                o.DueDate,
                db.UserFavorites.Any(uf =>
                    uf.UserId == userId && uf.EntityType == EFavoriteEntityType.Project && uf.EntityId == o.Id),
                db.ProjectMembers
                    .Where(pm => pm.WorkspaceId == workspaceId && pm.ProjectId == o.Id)
                    .Select(pm => new ProjectMemberDto(pm.UserId, pm.User.FullName, pm.User.Email, pm.Role))
                    .ToList()
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        return new Response<ProjectDto>(record);
    }

    public async Task<Response<ProjectDto>> CreateProjectAsync(Guid workspaceId, ProjectDto dto)
    {
        var project = new Project
        {
            WorkspaceId = workspaceId,
            Name = dto.Name,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            CreatedBy = accessor.GetUserId()
        };
        db.Projects.Add(project);

        if (dto.Team is not null && dto.Team.Count > 0)
        {
            var workspaceMemberIds = await db.WorkspaceMembers
                .Where(o => o.WorkspaceId == workspaceId)
                .Select(o => o.UserId)
                .ToHashSetAsync();

            var membersToAdd = dto.Team
                .Where(member => workspaceMemberIds.Contains(member.Id))
                .Select(member => new ProjectMember
                {
                    WorkspaceId = workspaceId,
                    ProjectId = project.Id,
                    UserId = member.Id,
                    Role = member.Role
                });

            db.ProjectMembers.AddRange(membersToAdd);
        }

        await db.SaveChangesAsync();
        return new Response<ProjectDto>("Project created.",
            await GetProjectByIdAsync(workspaceId, project.Id).TryGetDataAsync());
    }

    public async Task<Response<ProjectDto>> UpdateProjectAsync(Guid workspaceId, Guid projectId, ProjectDto dto)
    {
        var project =
            await db.Projects.SingleOrDefaultAsync(o => o.WorkspaceId == workspaceId && o.Id == projectId) ??
            throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.Status = dto.Status;
        project.Priority = dto.Priority;
        project.DueDate = dto.DueDate;
        project.UpdatedAt = DateTimeOffset.UtcNow;
        project.UpdatedBy = accessor.GetUserId();

        var existingMembers = db.ProjectMembers.Where(o => o.WorkspaceId == workspaceId && o.ProjectId == projectId);
        db.ProjectMembers.RemoveRange(existingMembers);

        if (dto.Team is not null && dto.Team.Count > 0)
        {
            var workspaceMembers = await db.WorkspaceMembers
                .Where(o => o.WorkspaceId == workspaceId)
                .Select(o => o.UserId)
                .ToHashSetAsync();

            var membersToAdd = dto.Team
                .Where(o => workspaceMembers.Contains(o.Id))
                .Select(o => new ProjectMember
                {
                    WorkspaceId = workspaceId,
                    ProjectId = project.Id,
                    UserId = o.Id,
                    Role = o.Role
                });

            db.ProjectMembers.AddRange(membersToAdd);
        }

        await db.SaveChangesAsync();
        return new Response<ProjectDto>("Project updated.",
            await GetProjectByIdAsync(workspaceId, projectId).TryGetDataAsync());
    }

    public async Task<Response> DeleteProjectAsync(Guid workspaceId, Guid projectId)
    {
        var project =
            await db.Projects.SingleOrDefaultAsync(o => o.WorkspaceId == workspaceId && o.Id == projectId) ??
            throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        project.DeletedAt = DateTimeOffset.UtcNow;
        project.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Project deleted.");
    }


    public async Task<Response<List<ProjectMemberDto>>> GetProjectMembersAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.ProjectMembers
            .Where(o => o.WorkspaceId == workspaceId && o.ProjectId == projectId)
            .Select(o => new ProjectMemberDto(o.UserId, o.User.FullName, o.User.Email, o.Role))
            .OrderBy(o => o.FullName)
            .ToListAsync();

        return new Response<List<ProjectMemberDto>>(records);
    }
}