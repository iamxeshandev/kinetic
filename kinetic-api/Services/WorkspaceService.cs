using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Workspace;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class WorkspaceService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response<List<WorkspaceDto>>> GetAllWorkspacesAsync()
    {
        var records = await db.WorkspaceMembers
            .Where(o => o.UserId == accessor.GetUserId())
            .OrderByDescending(o => o.Workspace.IsPersonal)
            .ThenByDescending(o => o.CreatedAt)
            .Select(o => new WorkspaceDto(
                o.Workspace.Id,
                o.Workspace.Name,
                o.Role,
                o.Workspace.IsPersonal,
                db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
            ))
            .ToListAsync();

        return new Response<List<WorkspaceDto>>(records);
    }

    public async Task<Response<WorkspaceDto>> GetWorkspaceByIdAsync(Guid workspaceId)
    {
        var record = await db.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
            .Select(o => new WorkspaceDto(
                o.Workspace.Id,
                o.Workspace.Name,
                o.Role,
                o.Workspace.IsPersonal,
                db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        return new Response<WorkspaceDto>(record);
    }

    public async Task<Response<WorkspaceDto>> CreateWorkspaceAsync(WorkspaceDto workspaceDto)
    {
        var workspace = new Workspace
        {
            Name = workspaceDto.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Workspaces.Add(workspace);

        var workspaceMember = new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = accessor.GetUserId(),
            Role = EWorkspaceRole.Owner,
            CreatedBy = accessor.GetUserId()
        };
        db.WorkspaceMembers.Add(workspaceMember);

        await db.SaveChangesAsync();
        return new Response<WorkspaceDto>("Workspace created.",
            await GetWorkspaceByIdAsync(workspace.Id).TryGetDataAsync());
    }

    public async Task<Response<WorkspaceDto>> UpdateWorkspaceAsync(Guid workspaceId, WorkspaceDto workspaceDto)
    {
        var workspace = await db.WorkspaceMembers
                            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
                            .Select(o => o.Workspace).SingleOrDefaultAsync() ??
                        throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        workspace.Name = workspaceDto.Name;
        workspace.UpdatedAt = DateTime.UtcNow;
        workspace.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<WorkspaceDto>("Workspace updated.",
            await GetWorkspaceByIdAsync(workspace.Id).TryGetDataAsync());
    }

    public async Task<Response> DeleteWorkspaceAsync(Guid workspaceId)
    {
        var workspace = await db.WorkspaceMembers
                            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
                            .Select(o => o.Workspace).SingleOrDefaultAsync() ??
                        throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        if (workspace.IsPersonal)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot delete personal workspace.");

        workspace.DeletedAt = DateTime.UtcNow;
        workspace.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Workspace deleted.");
    }
}