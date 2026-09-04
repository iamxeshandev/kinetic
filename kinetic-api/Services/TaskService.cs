using System.Net;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Task;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Services;

public class TaskService(AppDbContext db, HttpContextAccessor accessor)
{
    public async Task<Response<List<TaskDto>>> GetAllTasksAsync(Guid projectId)
    {
        var records = await db.Tasks
            .Where(o => o.Section.ProjectId == projectId)
            .Select(o => new TaskDto(
                o.Id,
                o.SectionId,
                o.Name,
                db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto(st.Id, st.TaskId, st.Name))
                    .ToList()
            ))
            .ToListAsync();

        return new Response<List<TaskDto>>(records);
    }

    public async Task<Response<TaskDto>> GetTaskByIdAsync(Guid projectId, Guid taskId)
    {
        var record = await db.Tasks
            .Where(o => o.Section.ProjectId == projectId && o.Id == taskId)
            .Select(o => new TaskDto(
                o.Id,
                o.SectionId,
                o.Name,
                db.Subtasks
                    .Where(st => st.TaskId == o.Id)
                    .Select(st => new SubtaskDto(st.Id, st.TaskId, st.Name))
                    .ToList()
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        return new Response<TaskDto>(record);
    }

    public async Task<Response<TaskDto>> CreateTaskAsync(Guid projectId, Guid sectionId, TaskDto dto)
    {
        var sectionExists = await db.Sections.AnyAsync(o => o.ProjectId == projectId && o.Id == sectionId);
        if (!sectionExists)
            throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        var task = new Task
        {
            SectionId = dto.SectionId,
            Name = dto.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Tasks.Add(task);

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task created.", await GetTaskByIdAsync(projectId, task.Id).TryGetDataAsync());
    }

    public async Task<Response<TaskDto>> UpdateTaskAsync(Guid projectId, Guid taskId, TaskDto dto)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(o => o.Section.ProjectId == projectId && o.Id == taskId) ??
                   throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        task.Name = dto.Name;
        task.UpdatedAt = DateTimeOffset.UtcNow;
        task.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task updated.", await GetTaskByIdAsync(projectId, taskId).TryGetDataAsync());
    }

    public async Task<Response> DeleteTaskAsync(Guid projectId, Guid taskId)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(o => o.Section.ProjectId == projectId && o.Id == taskId) ??
                   throw new ApiException(HttpStatusCode.NotFound, "Task not found");

        task.DeletedAt = DateTimeOffset.UtcNow;
        task.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Task deleted.");
    }


    public async Task<Response<List<SubtaskDto>>> GetAllSubtasksAsync(Guid taskId)
    {
        var records = await db.Subtasks
            .Where(o => o.TaskId == taskId)
            .Select(o => new SubtaskDto(o.Id, o.TaskId, o.Name))
            .ToListAsync();

        return new Response<List<SubtaskDto>>(records);
    }

    public async Task<Response<SubtaskDto>> GetSubtaskByIdAsync(Guid subtaskId)
    {
        var records = await db.Subtasks
            .Where(o => o.Id == subtaskId)
            .Select(o => new SubtaskDto(o.Id, o.TaskId, o.Name))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        return new Response<SubtaskDto>(records);
    }

    public async Task<Response<SubtaskDto>> CreateSubtaskAsync(Guid taskId, SubtaskDto dto)
    {
        var subtask = new Subtask
        {
            TaskId = taskId,
            Name = dto.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Subtasks.Add(subtask);

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask created.", await GetSubtaskByIdAsync(subtask.Id).TryGetDataAsync());
    }

    public async Task<Response<SubtaskDto>> UpdateSubtaskAsync(Guid taskId, Guid subtaskId, SubtaskDto dto)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o => o.TaskId == taskId && o.Id == subtaskId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found");

        subtask.Name = dto.Name;
        subtask.UpdatedAt = DateTimeOffset.UtcNow;
        subtask.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask updated.", await GetSubtaskByIdAsync(subtaskId).TryGetDataAsync());
    }

    public async Task<Response> DeleteSubtaskAsync(Guid taskId, Guid subtaskId)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o => o.TaskId == taskId && o.Id == subtaskId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found.");

        subtask.DeletedAt = DateTimeOffset.UtcNow;
        subtask.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Subtask deleted.");
    }
}