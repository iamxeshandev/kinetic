using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class SubtaskService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response<List<SubtaskDto>>> GetAllSubtasksAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        var records = await db.Subtasks
            .Where(o => o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                        o.Task.Section.Project.WorkspaceId == workspaceId)
            .Select(o => new SubtaskDto(o.Id, o.TaskId, o.Name))
            .ToListAsync();

        return new Response<List<SubtaskDto>>(records);
    }

    public async Task<Response<SubtaskDto>> GetSubtaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId)
    {
        var records = await db.Subtasks
            .Where(o => o.Id == subtaskId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                        o.Task.Section.Project.WorkspaceId == workspaceId)
            .Select(o => new SubtaskDto(o.Id, o.TaskId, o.Name))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        return new Response<SubtaskDto>(records);
    }

    public async Task<Response<SubtaskDto>> CreateSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        SubtaskRequest request)
    {
        var taskExists = await db.Tasks.AnyAsync(o =>
            o.Id == taskId && o.Section.ProjectId == projectId && o.Section.Project.WorkspaceId == workspaceId);
        if (!taskExists)
            throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        var subtask = new Subtask
        {
            TaskId = taskId,
            Name = request.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Subtasks.Add(subtask);

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask created.",
            await GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtask.Id).GetDataAsync());
    }

    public async Task<Response<SubtaskDto>> UpdateSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId, SubtaskRequest request)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o =>
                          o.Id == subtaskId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                          o.Task.Section.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found");

        subtask.Name = request.Name;
        subtask.UpdatedAt = DateTimeOffset.UtcNow;
        subtask.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask updated.",
            await GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtaskId).GetDataAsync());
    }

    public async Task<Response> DeleteSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId, Guid subtaskId)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o =>
                          o.Id == subtaskId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                          o.Task.Section.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        subtask.DeletedAt = DateTimeOffset.UtcNow;
        subtask.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Subtask deleted.");
    }
}