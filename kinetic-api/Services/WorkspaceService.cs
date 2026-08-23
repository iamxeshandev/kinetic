using System.Net;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Workspace;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class WorkspaceService(AppDbContext dbContext, IHttpContextAccessor accessor)
{
    public async Task<Response<List<WorkspaceDto>>> GetAllWorkspaces()
    {
        var records = await dbContext.WorkspaceMembers
            .AsNoTracking()
            .Where(o => o.UserId == accessor.GetUserId())
            .Select(o => new WorkspaceDto(o.Workspace.Id, o.Workspace.Name))
            .ToListAsync();

        return new Response<List<WorkspaceDto>>(records);
    }

    public async Task<Response<WorkspaceDto>> GetWorkspaceByIdAsync(Guid workspaceId)
    {
        var record = await dbContext.WorkspaceMembers
            .AsNoTracking()
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
            .Select(o => new WorkspaceDto(o.Workspace.Id, o.Workspace.Name))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        return new Response<WorkspaceDto>(record);
    }

    public async Task<Response<WorkspaceDto>> CreateWorkspaceAsync(WorkspaceDto workspaceDto)
    {
        var workspace = new Workspace
        {
            Name = workspaceDto.Name,
            CreatedBy = accessor.GetUserId()
        };
        dbContext.Workspaces.Add(workspace);

        var workspaceMember = new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = accessor.GetUserId(),
            Role = EWorkspaceRole.Owner
        };
        dbContext.WorkspaceMembers.Add(workspaceMember);

        await dbContext.SaveChangesAsync();
        return new Response<WorkspaceDto>("Workspace created.", workspaceDto);
    }

    public async Task<Response<WorkspaceDto>> UpdateWorkspaceAsync(Guid workspaceId, WorkspaceDto workspaceDto)
    {
        var workspace = await dbContext.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
            .Select(o => o.Workspace)
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        workspace.Name = workspaceDto.Name;
        workspace.UpdatedAt = DateTime.UtcNow;
        workspace.UpdatedBy = accessor.GetUserId();

        await dbContext.SaveChangesAsync();
        return new Response<WorkspaceDto>("Workspace updated.", workspaceDto);
    }

    public async Task<Response> DeleteWorkspaceAsync(Guid workspaceId)
    {
        var workspace = await dbContext.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == accessor.GetUserId())
            .Select(o => o.Workspace)
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        workspace.DeletedAt = DateTime.UtcNow;
        workspace.DeletedBy = accessor.GetUserId();

        await dbContext.SaveChangesAsync();
        return new Response("Workspace deleted.");
    }
}