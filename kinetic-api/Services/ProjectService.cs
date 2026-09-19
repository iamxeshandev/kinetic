using System.Net;
using kinetic_api.Data;
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
                             pm.UserId == userId && pm.ProjectId == o.Id && pm.Project.WorkspaceId == workspaceId)))
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new ProjectDto(
                o.Id,
                o.Name,
                o.Description,
                o.Status,
                o.Priority,
                db.ProjectMembers
                    .Where(pm => pm.ProjectId == o.Id && pm.UserId == userId)
                    .Select(pm => (EProjectRole?)pm.Role)
                    .SingleOrDefault(),
                db.UserFavorites.Any(uf => uf.UserId == userId && uf.EntityId == o.Id),
                o.DueDate,
                db.ProjectMembers
                    .Where(pm => pm.ProjectId == o.Id && pm.Project.WorkspaceId == workspaceId)
                    .OrderBy(pm => pm.Role)
                    .ThenBy(pm => pm.User.FirstName)
                    .ThenBy(pm => pm.User.LastName)
                    .Select(pm => new ProjectMemberDto(
                        pm.UserId,
                        pm.User.Email!,
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.AvatarKey.ToPublicUrl(),
                        pm.Role
                    ))
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
                db.ProjectMembers
                    .Where(pm => pm.ProjectId == o.Id && pm.UserId == userId)
                    .Select(pm => (EProjectRole?)pm.Role)
                    .SingleOrDefault(),
                db.UserFavorites.Any(uf => uf.UserId == userId && uf.EntityId == o.Id),
                o.DueDate,
                db.ProjectMembers
                    .Where(pm => pm.ProjectId == o.Id && pm.Project.WorkspaceId == workspaceId)
                    .Select(pm => new ProjectMemberDto(
                        pm.UserId,
                        pm.User.Email!,
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.AvatarKey.ToPublicUrl(),
                        pm.Role
                    ))
                    .ToList()
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        return new Response<ProjectDto>(record);
    }

    public async Task<Response<ProjectDto>> CreateProjectAsync(Guid workspaceId, ProjectRequest request)
    {
        var project = new Project
        {
            WorkspaceId = workspaceId,
            Name = request.Name,
            Description = request.Description,
            Status = request.Status,
            Priority = request.Priority,
            DueDate = request.DueDate,
            CreatedBy = accessor.GetUserId()
        };
        db.Projects.Add(project);

        var projectLeads = request.LeadIds?.Count > 0
            ? await db.WorkspaceMembers.Where(o => o.WorkspaceId == workspaceId && request.LeadIds.Contains(o.UserId))
                .Select(o => new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = o.UserId,
                    Role = EProjectRole.Lead
                })
                .ToListAsync()
            : [];

        var projectMembers = request.MemberIds?.Count > 0
            ? await db.WorkspaceMembers.Where(o => o.WorkspaceId == workspaceId && request.MemberIds.Contains(o.UserId))
                .Select(o => new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = o.UserId,
                    Role = EProjectRole.Member
                })
                .ToListAsync()
            : [];

        db.ProjectMembers.AddRange([.. projectLeads, .. projectMembers]);

        await db.SaveChangesAsync();
        return new Response<ProjectDto>("Project created.",
            await GetProjectByIdAsync(workspaceId, project.Id).GetDataAsync());
    }

    public async Task<Response<ProjectDto>> UpdateProjectAsync(Guid workspaceId, Guid projectId, ProjectRequest request)
    {
        var project =
            await db.Projects.SingleOrDefaultAsync(o => o.WorkspaceId == workspaceId && o.Id == projectId) ??
            throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        project.Name = request.Name;
        project.Description = request.Description;
        project.Status = request.Status;
        project.Priority = request.Priority;
        project.DueDate = request.DueDate;
        project.UpdatedAt = DateTimeOffset.UtcNow;
        project.UpdatedBy = accessor.GetUserId();

        var existingMembers =
            db.ProjectMembers.Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        db.ProjectMembers.RemoveRange(existingMembers);

        var projectLeads = request.LeadIds?.Count > 0
            ? await db.WorkspaceMembers.Where(o => o.WorkspaceId == workspaceId && request.LeadIds.Contains(o.UserId))
                .Select(o => new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = o.UserId,
                    Role = EProjectRole.Lead
                })
                .ToListAsync()
            : [];

        var projectMembers = request.MemberIds?.Count > 0
            ? await db.WorkspaceMembers.Where(o => o.WorkspaceId == workspaceId && request.MemberIds.Contains(o.UserId))
                .Select(o => new ProjectMember
                {
                    ProjectId = project.Id,
                    UserId = o.UserId,
                    Role = EProjectRole.Member
                })
                .ToListAsync()
            : [];

        db.ProjectMembers.AddRange([.. projectLeads, .. projectMembers]);

        await db.SaveChangesAsync();
        return new Response<ProjectDto>("Project updated.",
            await GetProjectByIdAsync(workspaceId, projectId).GetDataAsync());
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
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.User.FirstName)
            .ThenBy(o => o.User.LastName)
            .Select(o => new ProjectMemberDto(
                o.UserId,
                o.User.Email!,
                o.User.FirstName,
                o.User.LastName,
                o.User.AvatarKey.ToPublicUrl(),
                o.Role)
            )
            .ToListAsync();

        return new Response<List<ProjectMemberDto>>(records);
    }
}