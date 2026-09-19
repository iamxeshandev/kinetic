using System.Data;
using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Dtos.Task;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Services;

public class TaskService(AppDbContext db, IHttpContextAccessor accessor)
{
    private const long TaskPositionStep = 1000000;

    private async Task<List<Task>> NormalizeTaskPositionsAsync(Guid workspaceId, Guid projectId, Guid sectionId)
    {
        var tasks = await db.Tasks
            .Where(o =>
                o.SectionId == sectionId &&
                o.Section.ProjectId == projectId &&
                o.Section.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .ToListAsync();

        var position = 0L;

        foreach (var task in tasks)
            task.Position = position += TaskPositionStep;

        await db.SaveChangesAsync();
        return tasks;
    }


    public async Task<Response<List<TaskDto>>> GetAllTasksAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.Tasks
            .Where(o => o.Section.ProjectId == projectId && o.Section.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .Select(o => new TaskDto(
                o.Id,
                o.SectionId,
                o.Name,
                o.Description,
                o.Priority,
                o.DueDate,
                o.CompletedAt,
                o.AssignedAt,
                db.ProjectMembers
                    .Where(pm =>
                        pm.ProjectId == projectId && pm.UserId == o.AssigneeId && pm.Project.WorkspaceId == workspaceId)
                    .Select(pm => new ProjectMemberDto(
                        pm.UserId,
                        pm.User.Email!,
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.AvatarKey.ToPublicUrl(),
                        pm.Role
                    ))
                    .SingleOrDefault(),
                db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto(st.Id, st.TaskId, st.Name))
                    .ToList(),
                db.TaskAttachments
                    .Where(ta =>
                        ta.TaskId == o.Id && ta.Task.Section.ProjectId == projectId &&
                        ta.Task.Section.Project.WorkspaceId == workspaceId)
                    .Select(ta => new TaskAttachmentDto(
                        ta.Id,
                        ta.FileName,
                        ta.ContentType,
                        ta.SizeBytes,
                        $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{o.Id}/attachments/{ta.Id}/download"
                    ))
                    .ToList()
            ))
            .ToListAsync();

        return new Response<List<TaskDto>>(records);
    }

    public async Task<Response<TaskDto>> GetTaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        var record = await db.Tasks
            .Where(o => o.Id == taskId && o.Section.ProjectId == projectId &&
                        o.Section.Project.WorkspaceId == workspaceId)
            .Select(o => new TaskDto(
                o.Id,
                o.SectionId,
                o.Name,
                o.Description,
                o.Priority,
                o.DueDate,
                o.CompletedAt,
                o.AssignedAt,
                db.ProjectMembers
                    .Where(pm =>
                        pm.ProjectId == projectId && pm.UserId == o.AssigneeId && pm.Project.WorkspaceId == workspaceId)
                    .Select(pm => new ProjectMemberDto(
                        pm.UserId,
                        pm.User.Email!,
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.AvatarKey.ToPublicUrl(),
                        pm.Role
                    ))
                    .SingleOrDefault(),
                db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto(st.Id, st.TaskId, st.Name))
                    .ToList(),
                db.TaskAttachments
                    .Where(ta =>
                        ta.TaskId == o.Id && ta.Task.Section.ProjectId == projectId &&
                        ta.Task.Section.Project.WorkspaceId == workspaceId)
                    .Select(ta => new TaskAttachmentDto(
                        ta.Id,
                        ta.FileName,
                        ta.ContentType,
                        ta.SizeBytes,
                        $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{o.Id}/attachments/{ta.Id}/download"
                    ))
                    .ToList()
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        return new Response<TaskDto>(record);
    }

    public async Task<Response<TaskDto>> CreateTaskAsync(Guid workspaceId, Guid projectId, TaskRequest request)
    {
        var sectionExists = await db.Sections.AnyAsync(o =>
            o.Id == request.SectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        if (!sectionExists)
            throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        var lastPosition =
            await db.Tasks
                .Where(o => o.SectionId == request.SectionId && o.Section.ProjectId == projectId &&
                            o.Section.Project.WorkspaceId == workspaceId).MaxAsync(o => (long?)o.Position) ?? 0L;

        var task = new Task
        {
            SectionId = request.SectionId,
            Name = request.Name,
            Position = lastPosition + TaskPositionStep,
            CreatedBy = accessor.GetUserId()
        };
        db.Tasks.Add(task);

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task created.",
            await GetTaskByIdAsync(workspaceId, projectId, task.Id).GetDataAsync());
    }

    public async Task<Response<TaskDto>> UpdateTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        TaskRequest request)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(o =>
                       o.Id == taskId && o.Section.ProjectId == projectId &&
                       o.Section.Project.WorkspaceId == workspaceId) ??
                   throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        task.Name = request.Name;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;

        if (task.AssigneeId != request.AssigneeId)
        {
            task.AssigneeId = request.AssigneeId;
            task.AssignedAt = request.AssigneeId.HasValue ? DateTimeOffset.UtcNow : null;
        }

        task.UpdatedAt = DateTimeOffset.UtcNow;
        task.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task updated.",
            await GetTaskByIdAsync(workspaceId, projectId, taskId).GetDataAsync());
    }

    public async Task<Response> MoveTaskAsync(Guid workspaceId, Guid projectId, Guid taskId, MoveTaskRequest request)
    {
        var strategy = db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            var taskExists = await db.Tasks.AnyAsync(o =>
                o.Id == taskId && o.Section.ProjectId == projectId &&
                o.Section.Project.WorkspaceId == workspaceId);
            if (!taskExists)
                throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

            var sectionExists = await db.Sections.AnyAsync(o =>
                o.Id == request.SectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
            if (!sectionExists)
                throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

            var newPosition = request switch
            {
                { PreviousTaskId: null } => (await db.Tasks
                    .Where(o => o.Id != taskId &&
                                o.SectionId == request.SectionId &&
                                o.Section.ProjectId == projectId &&
                                o.Section.Project.WorkspaceId == workspaceId)
                    .Select(o => (long?)o.Position)
                    .MinAsync() ?? 2 * TaskPositionStep) - TaskPositionStep,

                { NextTaskId: null } => (await db.Tasks
                    .Where(o => o.Id != taskId &&
                                o.SectionId == request.SectionId &&
                                o.Section.ProjectId == projectId &&
                                o.Section.Project.WorkspaceId == workspaceId)
                    .Select(o => (long?)o.Position)
                    .MaxAsync() ?? 0L) + TaskPositionStep,

                _ => await db.Tasks
                    .Where(o =>
                        (o.Id == request.PreviousTaskId.Value || o.Id == request.NextTaskId.Value) &&
                        o.SectionId == request.SectionId && o.Section.ProjectId == projectId &&
                        o.Section.Project.WorkspaceId == workspaceId)
                    .OrderBy(o => o.Position)
                    .Select(o => o.Position)
                    .ToListAsync() is { Count: 2 } positions
                    ? positions[1] - positions[0] <= 1
                        ? (await NormalizeTaskPositionsAsync(workspaceId, projectId, request.SectionId))
                        .Where(o => o.Id == request.PreviousTaskId.Value || o.Id == request.NextTaskId.Value)
                        .Select(o => o.Position)
                        .Sum() / 2
                        : positions.Sum() / 2
                    : throw new ApiException(HttpStatusCode.BadRequest, "Invalid neighbouring tasks.")
            };

            await db.Tasks
                .Where(o =>
                    o.Id == taskId && o.Section.ProjectId == projectId && o.Section.Project.WorkspaceId == workspaceId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(o => o.Position, newPosition).SetProperty(o => o.SectionId, request.SectionId));

            await transaction.CommitAsync();

            return new Response("Task moved.");
        });
    }

    public async Task<Response> MoveSectionTasksAsync(Guid workspaceId, Guid projectId, Guid sectionId,
        Guid newSectionId)
    {
        var newSectionExists = await db.Sections.AnyAsync(o =>
            o.Id == newSectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        if (!newSectionExists)
            throw new ApiException(HttpStatusCode.NotFound, "Target section not found.");

        var lastPosition = await db.Tasks
            .Where(o => o.SectionId == newSectionId && o.Section.ProjectId == projectId &&
                        o.Section.Project.WorkspaceId == workspaceId).Select(o => (long?)o.Position).MaxAsync() ?? 0L;

        var tasks = await db.Tasks
            .Where(o =>
                o.SectionId == sectionId && o.Section.ProjectId == projectId &&
                o.Section.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .ToListAsync();

        foreach (var task in tasks)
        {
            task.SectionId = newSectionId;
            task.Position = lastPosition += TaskPositionStep;
        }

        await db.SaveChangesAsync();
        return new Response("Tasks moved.");
    }

    public async Task<Response> DeleteTaskAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(o =>
                       o.Id == taskId && o.Section.ProjectId == projectId &&
                       o.Section.Project.WorkspaceId == workspaceId) ??
                   throw new ApiException(HttpStatusCode.NotFound, "Task not found");

        task.DeletedAt = DateTimeOffset.UtcNow;
        task.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Task deleted.");
    }

    public async Task<Response> DeleteSectionTasksAsync(Guid workspaceId, Guid projectId, Guid sectionId)
    {
        var userId = accessor.GetUserId();

        var tasks = await db.Tasks.Where(o =>
            o.SectionId == sectionId && o.Section.ProjectId == projectId &&
            o.Section.Project.WorkspaceId == workspaceId).ToListAsync();

        foreach (var task in tasks)
        {
            task.DeletedAt = DateTimeOffset.UtcNow;
            task.DeletedBy = userId;
        }

        await db.SaveChangesAsync();
        return new Response("Tasks deleted.");
    }
}