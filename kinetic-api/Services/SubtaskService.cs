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
    private const long SubtaskPositionStep = 1000000;

    private async Task<List<Subtask>> NormalizeSubtasksAsync(Guid taskId)
    {
        var subtasks = await db.Subtasks
            .Where(o => o.TaskId == taskId)
            .OrderBy(o => o.Position)
            .ToListAsync();

        var position = 0L;

        foreach (var subtask in subtasks)
            subtask.Position = position += SubtaskPositionStep;

        await db.SaveChangesAsync();
        return subtasks;
    }

    private async Task<long> GetNewSubtaskPositionAsync(Guid taskId, Guid? previousSubtaskId, Guid? nextSubtaskId)
    {
        return new { previousSubtaskId, nextSubtaskId } switch
        {
            { previousSubtaskId: null } => (await db.Subtasks
                .Where(o => o.TaskId == taskId)
                .MinAsync(o => (long?)o.Position) ?? 2 * SubtaskPositionStep) - SubtaskPositionStep,

            { nextSubtaskId: null } => (await db.Subtasks
                .Where(o => o.TaskId == taskId)
                .MaxAsync(o => (long?)o.Position) ?? 0L) + SubtaskPositionStep,

            _ => await db.Subtasks
                .Where(o => (o.Id == previousSubtaskId || o.Id == nextSubtaskId) && o.TaskId == taskId)
                .OrderBy(o => o.Position)
                .Select(o => o.Position)
                .ToListAsync() is { Count: 2 } positions
                ? positions[1] - positions[0] <= 1
                    ? (await NormalizeSubtasksAsync(taskId))
                    .Where(o => o.Id == previousSubtaskId || o.Id == nextSubtaskId).Sum(o => o.Position) / 2
                    : positions.Sum() / 2
                : throw new ApiException(HttpStatusCode.BadRequest, "Invalid neighbouring subtasks.")
        };
    }


    public async Task<Response<List<SubtaskDto>>> GetAllSubtasksAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        var records = await db.Subtasks
            .Where(o =>
                o.TaskId == taskId &&
                o.Task.ProjectId == projectId &&
                o.Task.Project.WorkspaceId == workspaceId
            )
            .OrderBy(o => o.Position)
            .Select(o => new SubtaskDto
            {
                Id = o.Id,
                Name = o.Name,
                Position = o.Position,
                CompletedAt = o.CompletedAt
            })
            .ToListAsync();

        return new Response<List<SubtaskDto>>(records);
    }

    public async Task<Response<SubtaskDto>> GetSubtaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId)
    {
        var records = await db.Subtasks
            .Where(o =>
                o.Id == subtaskId &&
                o.TaskId == taskId &&
                o.Task.ProjectId == projectId &&
                o.Task.Project.WorkspaceId == workspaceId
            )
            .Select(o => new SubtaskDto
            {
                Id = o.Id,
                Name = o.Name,
                Position = o.Position,
                CompletedAt = o.CompletedAt
            })
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        return new Response<SubtaskDto>(records);
    }

    public async Task<Response<SubtaskDto>> CreateSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        SubtaskRequest request)
    {
        var taskExists = await db.Tasks.AnyAsync(o =>
            o.Id == taskId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        if (!taskExists)
            throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        var subtask = new Subtask
        {
            TaskId = taskId,
            Name = request.Name,
            Position = await GetNewSubtaskPositionAsync(taskId, request.PreviousSubtaskId, request.NextSubtaskId),
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
                          o.Id == subtaskId && o.TaskId == taskId && o.Task.ProjectId == projectId &&
                          o.Task.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found");

        subtask.Name = request.Name;
        subtask.CompletedAt = request.IsCompleted ? subtask.CompletedAt ?? DateTimeOffset.UtcNow : null;
        subtask.UpdatedAt = DateTimeOffset.UtcNow;
        subtask.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask updated.",
            await GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtaskId).GetDataAsync());
    }

    public async Task<Response> DeleteSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId, Guid subtaskId)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o =>
                          o.Id == subtaskId && o.TaskId == taskId && o.Task.ProjectId == projectId &&
                          o.Task.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        subtask.DeletedAt = DateTimeOffset.UtcNow;
        subtask.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Subtask deleted.");
    }
}