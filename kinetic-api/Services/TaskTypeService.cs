using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskType;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class TaskTypeService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response<TaskTypeDto[]>> GetAllTaskTypesAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.TaskTypes
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Name)
            .Select(o => new TaskTypeDto
            {
                Id = o.Id,
                Name = o.Name,
                Code = o.Code
            })
            .ToArrayAsync();

        return new Response<TaskTypeDto[]>(records);
    }

    public async Task<Response<TaskTypeDto>> GetTaskTypeByIdAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        var record = await db.TaskTypes
            .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .Select(o =>
                new TaskTypeDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Code = o.Code
                })
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Task type not found.");

        return new Response<TaskTypeDto>(record);
    }

    public async Task<Response<TaskTypeDto>> CreateTaskTypeAsync(Guid workspaceId, Guid projectId,
        TaskTypeRequest request)
    {
        var nameExists = await db.TaskTypes.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Name == request.Name);
        if (nameExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task type name already exists.");

        var codeExists = await db.TaskTypes.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Code == request.Code);
        if (codeExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task type code already exists.");

        var taskType = new TaskType
        {
            ProjectId = projectId,
            Name = request.Name,
            Code = request.Code,
            CreatedBy = accessor.GetUserId()
        };
        db.TaskTypes.Add(taskType);

        await db.SaveChangesAsync();
        return new Response<TaskTypeDto>("Task type created.",
            await GetTaskTypeByIdAsync(workspaceId, projectId, taskType.Id).GetDataAsync());
    }

    public async Task<Response<TaskTypeDto>> UpdateTaskTypeAsync(Guid workspaceId, Guid projectId, Guid taskTypeId,
        TaskTypeRequest request)
    {
        var taskType =
            await db.TaskTypes
                .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .SingleOrDefaultAsync() ??
            throw new ApiException(HttpStatusCode.NotFound, "Task type not found.");

        var nameExists = await db.TaskTypes.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Name == request.Name);
        if (nameExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task type name already exists.");

        var codeExists = await db.TaskTypes.AnyAsync(o =>
            o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId && o.Code == request.Code);
        if (codeExists)
            throw new ApiException(HttpStatusCode.BadRequest, "Task type code already exists.");

        taskType.Name = request.Name;
        taskType.Code = request.Code;
        taskType.UpdatedAt = DateTimeOffset.UtcNow;
        taskType.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<TaskTypeDto>("Task type updated.",
            await GetTaskTypeByIdAsync(workspaceId, projectId, taskType.Id).GetDataAsync());
    }

    public async Task<Response> DeleteTaskTypeAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        await db.TaskTypes
            .Where(o => o.Id == taskTypeId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .ExecuteUpdateAsync(s =>
                s.SetProperty(o => o.DeletedAt, DateTimeOffset.UtcNow)
                    .SetProperty(o => o.DeletedBy, accessor.GetUserId()));

        return new Response("Task type deleted.");
    }
}