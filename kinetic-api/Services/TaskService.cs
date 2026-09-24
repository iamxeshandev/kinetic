using System.Data;
using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Dtos.Task;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Dtos.TaskLabel;
using kinetic_api.Dtos.TaskType;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Services;

public class TaskService(AppDbContext db, IHttpContextAccessor accessor)
{
    private const long TaskPositionStep = 1000000;

    private async Task<List<Task>> NormalizeTaskPositionsAsync(Guid sectionId)
    {
        var tasks = await db.Tasks
            .Where(o => o.SectionId == sectionId)
            .OrderBy(o => o.Position)
            .ToListAsync();

        var position = 0L;

        foreach (var task in tasks)
            task.Position = position += TaskPositionStep;

        await db.SaveChangesAsync();
        return tasks;
    }

    private async Task<long?> GetNewTaskPositionAsync(Guid sectionId, Guid taskId, Guid? previousTaskId,
        Guid? nextTaskId)
    {
        return new { previousTaskId, nextTaskId } switch
        {
            { previousTaskId: null } => (await db.Tasks
                .Where(o => o.Id != taskId && o.SectionId == sectionId)
                .Select(o => (long?)o.Position)
                .MinAsync() ?? 2 * TaskPositionStep) - TaskPositionStep,

            { nextTaskId: null } => (await db.Tasks
                .Where(o => o.Id != taskId && o.SectionId == sectionId)
                .Select(o => (long?)o.Position)
                .MaxAsync() ?? 0L) + TaskPositionStep,

            _ => await db.Tasks
                .Where(o => (o.Id == previousTaskId || o.Id == nextTaskId) && o.SectionId == sectionId)
                .OrderBy(o => o.Position)
                .Select(o => o.Position)
                .ToListAsync() is { Count: 2 } positions
                ? positions[1] - positions[0] <= 1
                    ? (await NormalizeTaskPositionsAsync(sectionId))
                    .Where(o => o.Id == previousTaskId || o.Id == nextTaskId)
                    .Select(o => o.Position)
                    .Sum() / 2
                    : positions.Sum() / 2
                : null
        };
    }


    public async Task<Response<TaskDto[]>> GetAllTasksAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.Tasks
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .Select(o => new TaskDto
            {
                Id = o.Id,
                SectionId = o.SectionId,
                RefId = o.RefId,
                TaskType = o.TaskType == null
                    ? null
                    : new TaskTypeDto
                    {
                        Id = o.TaskType.Id,
                        Name = o.TaskType.Name,
                        Code = o.TaskType.Code
                    },
                Name = o.Name,
                Description = o.Description,
                Position = o.Position,
                Priority = o.Priority,
                DueDate = o.DueDate,
                CompletedAt = o.CompletedAt,
                AssignedAt = o.AssignedAt,
                Assignee = db.ProjectMembers
                    .Where(pm =>
                        pm.ProjectId == projectId &&
                        pm.UserId == o.AssigneeId &&
                        pm.Project.WorkspaceId == workspaceId
                    )
                    .Select(pm => new ProjectMemberDto
                    {
                        Id = pm.UserId,
                        Email = pm.User.Email!,
                        FirstName = pm.User.FirstName,
                        LastName = pm.User.LastName,
                        AvatarUrl = pm.User.AvatarKey.ToPublicUrl(),
                        Role = pm.Role
                    })
                    .SingleOrDefault(),
                TaskLabels = o.TaskLabels
                    .Select(tl => new TaskLabelDto
                    {
                        Id = tl.Id,
                        Name = tl.Name
                    })
                    .ToArray(),
                Subtasks = db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto
                    {
                        Id = st.Id,
                        Name = st.Name,
                        Position = st.Position,
                        CompletedAt = st.CompletedAt
                    })
                    .ToArray(),
                Attachments = db.TaskAttachments
                    .Where(ta =>
                        ta.TaskId == o.Id &&
                        ta.Task.ProjectId == projectId &&
                        ta.Task.Project.WorkspaceId == workspaceId
                    )
                    .Select(ta => new TaskAttachmentDto
                    {
                        Id = ta.Id,
                        FileName = ta.FileName,
                        ContentType = ta.ContentType,
                        SizeBytes = ta.SizeBytes,
                        DownloadUrl =
                            $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{o.Id}/attachments/{ta.Id}/download"
                    })
                    .ToArray()
            })
            .ToArrayAsync();

        return new Response<TaskDto[]>(records);
    }

    public async Task<Response<TaskDto>> GetTaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        var record = await db.Tasks
            .Where(o =>
                o.Id == taskId &&
                o.ProjectId == projectId &&
                o.Project.WorkspaceId == workspaceId
            )
            .Select(o => new TaskDto
            {
                Id = o.Id,
                SectionId = o.SectionId,
                RefId = o.RefId,
                TaskType = o.TaskType == null
                    ? null
                    : new TaskTypeDto
                    {
                        Id = o.TaskType.Id,
                        Name = o.TaskType.Name,
                        Code = o.TaskType.Code
                    },
                Name = o.Name,
                Description = o.Description,
                Position = o.Position,
                Priority = o.Priority,
                DueDate = o.DueDate,
                CompletedAt = o.CompletedAt,
                AssignedAt = o.AssignedAt,
                Assignee = db.ProjectMembers
                    .Where(pm =>
                        pm.ProjectId == projectId &&
                        pm.UserId == o.AssigneeId &&
                        pm.Project.WorkspaceId == workspaceId
                    )
                    .Select(pm => new ProjectMemberDto
                    {
                        Id = pm.UserId,
                        Email = pm.User.Email!,
                        FirstName = pm.User.FirstName,
                        LastName = pm.User.LastName,
                        AvatarUrl = pm.User.AvatarKey.ToPublicUrl(),
                        Role = pm.Role
                    })
                    .SingleOrDefault(),
                TaskLabels = o.TaskLabels
                    .Select(tl => new TaskLabelDto
                    {
                        Id = tl.Id,
                        Name = tl.Name
                    })
                    .ToArray(),
                Subtasks = db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto
                    {
                        Id = st.Id,
                        Name = st.Name,
                        Position = st.Position,
                        CompletedAt = st.CompletedAt
                    })
                    .ToArray(),
                Attachments = db.TaskAttachments
                    .Where(ta =>
                        ta.TaskId == o.Id
                        && ta.Task.ProjectId == projectId &&
                        ta.Task.Project.WorkspaceId == workspaceId
                    )
                    .Select(ta => new TaskAttachmentDto
                    {
                        Id = ta.Id,
                        FileName = ta.FileName,
                        ContentType = ta.ContentType,
                        SizeBytes = ta.SizeBytes,
                        DownloadUrl =
                            $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{o.Id}/attachments/{ta.Id}/download"
                    })
                    .ToArray()
            })
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
                .Where(o => o.SectionId == request.SectionId && o.ProjectId == projectId &&
                            o.Project.WorkspaceId == workspaceId).MaxAsync(o => (long?)o.Position) ?? 0L;

        var lastRefId = await db.Tasks.Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .MaxAsync(o => (int?)o.RefId) ?? 0;

        var task = new Task
        {
            ProjectId = projectId,
            SectionId = request.SectionId,
            RefId = lastRefId + 1,
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
        var strategy = db.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            var task = await db.Tasks.SingleOrDefaultAsync(o =>
                           o.Id == taskId && o.ProjectId == projectId &&
                           o.Project.WorkspaceId == workspaceId) ??
                       throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

            task.Name = request.Name;
            task.Description = request.Description;
            task.Priority = request.Priority;
            task.DueDate = request.DueDate;

            if (request.TaskTypeId.HasValue)
            {
                var taskTypeExists = await db.TaskTypes.AnyAsync(o =>
                    o.Id == request.TaskTypeId.Value && o.ProjectId == projectId &&
                    o.Project.WorkspaceId == workspaceId);
                if (!taskTypeExists)
                    throw new ApiException(HttpStatusCode.BadRequest, "Task type is invalid.");
            }

            task.TaskTypeId = request.TaskTypeId;

            var labelIds = request.TaskLabelIds.Distinct().ToArray();

            var labels = await db.TaskLabels
                .Where(o =>
                    labelIds.Contains(o.Id) &&
                    o.ProjectId == projectId &&
                    o.Project.WorkspaceId == workspaceId
                )
                .ToArrayAsync();

            if (labels.Length != labelIds.Length)
                throw new ApiException(HttpStatusCode.BadRequest, "One or more task labels are invalid.");

            task.TaskLabels = labels;

            if (task.AssigneeId != request.AssigneeId)
            {
                task.AssigneeId = request.AssigneeId;
                task.AssignedAt = request.AssigneeId.HasValue ? DateTimeOffset.UtcNow : null;
            }

            task.UpdatedAt = DateTimeOffset.UtcNow;
            task.UpdatedBy = accessor.GetUserId();

            await db.SaveChangesAsync();
            await transaction.CommitAsync();
        });

        return new Response<TaskDto>("Task updated.",
            await GetTaskByIdAsync(workspaceId, projectId, taskId).GetDataAsync());
    }

    public async Task<Response<TaskDto>> MoveTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        MoveTaskRequest request)
    {
        var strategy = db.Database.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            var taskExists = await db.Tasks.AnyAsync(o =>
                o.Id == taskId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
            if (!taskExists)
                throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

            var sectionExists = await db.Sections.AnyAsync(o =>
                o.Id == request.SectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
            if (!sectionExists)
                throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

            var newPosition =
                await GetNewTaskPositionAsync(request.SectionId, taskId, request.PreviousTaskId, request.NextTaskId) ??
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid position.");

            await db.Tasks
                .Where(o =>
                    o.Id == taskId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(o => o.Position, newPosition).SetProperty(o => o.SectionId, request.SectionId));

            await transaction.CommitAsync();
        });

        return new Response<TaskDto>("Task moved.",
            await GetTaskByIdAsync(workspaceId, projectId, taskId).GetDataAsync());
    }

    public async Task<Response> MoveSectionTasksAsync(Guid workspaceId, Guid projectId, Guid sectionId,
        Guid newSectionId)
    {
        var newSectionExists = await db.Sections.AnyAsync(o =>
            o.Id == newSectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        if (!newSectionExists)
            throw new ApiException(HttpStatusCode.NotFound, "Target section not found.");

        var lastPosition = await db.Tasks
            .Where(o => o.SectionId == newSectionId && o.ProjectId == projectId &&
                        o.Project.WorkspaceId == workspaceId).Select(o => (long?)o.Position).MaxAsync() ?? 0L;

        var tasks = await db.Tasks
            .Where(o =>
                o.SectionId == sectionId && o.ProjectId == projectId &&
                o.Project.WorkspaceId == workspaceId)
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
                       o.Id == taskId && o.ProjectId == projectId &&
                       o.Project.WorkspaceId == workspaceId) ??
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
            o.SectionId == sectionId && o.ProjectId == projectId &&
            o.Project.WorkspaceId == workspaceId).ToListAsync();

        foreach (var task in tasks)
        {
            task.DeletedAt = DateTimeOffset.UtcNow;
            task.DeletedBy = userId;
        }

        await db.SaveChangesAsync();
        return new Response("Tasks deleted.");
    }
}