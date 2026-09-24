using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskLabel;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class TaskLabelService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response<TaskLabelDto[]>> GetAllTaskLabelsAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.TaskLabels
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Name)
            .Select(o => new TaskLabelDto
            {
                Id = o.Id,
                Name = o.Name
            })
            .ToArrayAsync();

        return new Response<TaskLabelDto[]>(records);
    }

    public async Task<Response<TaskLabelDto>> GetTaskLabelByIdAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        var record = await db.TaskLabels
            .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .Select(o =>
                new TaskLabelDto
                {
                    Id = o.Id,
                    Name = o.Name
                })
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Task label not found.");

        return new Response<TaskLabelDto>(record);
    }

    public async Task<Response<TaskLabelDto>> CreateTaskLabelAsync(Guid workspaceId, Guid projectId,
        TaskLabelRequest request)
    {
        var nameExists = await db.TaskLabels.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Name == request.Name);
        if (nameExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task label name already exists.");

        var taskType = new TaskLabel
        {
            ProjectId = projectId,
            Name = request.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.TaskLabels.Add(taskType);

        await db.SaveChangesAsync();
        return new Response<TaskLabelDto>("Task label created.",
            await GetTaskLabelByIdAsync(workspaceId, projectId, taskType.Id).GetDataAsync());
    }

    public async Task<Response<TaskLabelDto>> UpdateTaskLabelAsync(Guid workspaceId, Guid projectId, Guid taskTypeId,
        TaskLabelRequest request)
    {
        var taskType =
            await db.TaskLabels
                .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .SingleOrDefaultAsync() ??
            throw new ApiException(HttpStatusCode.NotFound, "Task label not found.");

        var nameExists = await db.TaskLabels.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Name == request.Name);
        if (nameExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task label name already exists.");

        taskType.Name = request.Name;
        taskType.UpdatedAt = DateTimeOffset.UtcNow;
        taskType.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<TaskLabelDto>("Task label updated.",
            await GetTaskLabelByIdAsync(workspaceId, projectId, taskType.Id).GetDataAsync());
    }

    public async Task<Response> DeleteTaskLabelAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        await db.TaskLabels
            .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .ExecuteUpdateAsync(s =>
                s.SetProperty(o => o.DeletedAt, DateTimeOffset.UtcNow)
                    .SetProperty(o => o.DeletedBy, accessor.GetUserId()));

        return new Response("Task label deleted.");
    }
}