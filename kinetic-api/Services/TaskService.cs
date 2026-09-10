using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Dtos.Task;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Services;

public class TaskService(AppDbContext db, StorageService storageService, IHttpContextAccessor accessor)
{
    private const long TaskPositionStep = 1000000;


    #region Tasks

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
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.Email,
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
                        pm.User.FirstName,
                        pm.User.LastName,
                        pm.User.Email,
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

    public async Task<Response<TaskDto>> CreateTaskAsync(Guid workspaceId, Guid projectId, TaskDto dto)
    {
        var sectionExists = await db.Sections.AnyAsync(o =>
            o.Id == dto.SectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId);
        if (!sectionExists)
            throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        var lastPosition =
            await db.Tasks
                .Where(o => o.SectionId == dto.SectionId && o.Section.ProjectId == projectId &&
                            o.Section.Project.WorkspaceId == workspaceId).MaxAsync(o => (long?)o.Position) ?? 0L;

        var task = new Task
        {
            SectionId = dto.SectionId,
            Name = dto.Name,
            Description = dto.Description,
            Position = lastPosition + TaskPositionStep,
            CreatedBy = accessor.GetUserId()
        };
        db.Tasks.Add(task);

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task created.",
            await GetTaskByIdAsync(workspaceId, projectId, task.Id).TryGetDataAsync());
    }

    public async Task<Response<TaskDto>> UpdateTaskAsync(Guid workspaceId, Guid projectId, Guid taskId, TaskDto dto)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(o =>
                       o.Id == taskId && o.Section.ProjectId == projectId &&
                       o.Section.Project.WorkspaceId == workspaceId) ??
                   throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        task.Name = dto.Name;
        task.Description = dto.Description;
        task.UpdatedAt = DateTimeOffset.UtcNow;
        task.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<TaskDto>("Task updated.",
            await GetTaskByIdAsync(workspaceId, projectId, taskId).TryGetDataAsync());
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

    #endregion


    #region Task Attachments

    public async Task<Response<List<TaskAttachmentDto>>> GetAllTaskAttachmentsAsync(Guid workspaceId, Guid projectId,
        Guid taskId)
    {
        var records = await db.TaskAttachments
            .Where(o =>
                o.TaskId == taskId &&
                o.Task.Section.ProjectId == projectId &&
                o.Task.Section.Project.WorkspaceId == workspaceId
            )
            .Select(o => new TaskAttachmentDto(
                o.Id,
                o.FileName,
                o.ContentType,
                o.SizeBytes,
                $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{o.Id}/download"
            ))
            .ToListAsync();

        return new Response<List<TaskAttachmentDto>>(records);
    }

    public async Task<Response<TaskAttachmentDto>> GetTaskAttachmentByIdAsync(Guid workspaceId, Guid projectId,
        Guid taskId, Guid taskAttachmentId)
    {
        var record = await db.TaskAttachments
            .Where(o =>
                o.Id == taskAttachmentId &&
                o.TaskId == taskId &&
                o.Task.Section.ProjectId == projectId &&
                o.Task.Section.Project.WorkspaceId == workspaceId
            )
            .Select(o => new TaskAttachmentDto(
                o.Id,
                o.FileName,
                o.ContentType,
                o.SizeBytes,
                $"/api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{o.Id}/download"
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Task attachment not found.");

        return new Response<TaskAttachmentDto>(record);
    }

    public async Task<Response<TaskAttachmentDto>> UploadTaskAttachmentAsync(Guid workspaceId, Guid projectId,
        Guid taskId, IFormFile file)
    {
        const long maxFileSize = 1024 * 1024;

        switch (file.Length)
        {
            case 0:
                throw new ApiException(HttpStatusCode.BadRequest, "No file selected.");
            case > maxFileSize:
                throw new ApiException(HttpStatusCode.BadRequest, "File must be 1 MB max.");
        }

        var fileExtension = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(fileExtension))
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid file type.");

        var taskExists = await db.Tasks.AnyAsync(o =>
            o.Id == taskId && o.Section.ProjectId == projectId && o.Section.Project.WorkspaceId == workspaceId);
        if (!taskExists)
            throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        var storedFileName = $"{Guid.NewGuid():N}{fileExtension}";
        var relativePath = Path.Combine("workspaces", workspaceId.ToString(), "tasks", taskId.ToString(), "attachments",
            storedFileName);
        var absolutePath = storageService.GetPrivatePath(relativePath);

        Directory.CreateDirectory(Path.GetDirectoryName(absolutePath)!);

        await using var stream = new FileStream(absolutePath, FileMode.Create, FileAccess.Write);
        await file.CopyToAsync(stream);

        var taskAttachment = new TaskAttachment
        {
            TaskId = taskId,
            FileName = file.FileName,
            StorageKey = relativePath.Replace("\\", "/"),
            ContentType = file.ContentType,
            SizeBytes = file.Length,
            CreatedBy = accessor.GetUserId()
        };
        db.TaskAttachments.Add(taskAttachment);

        try
        {
            await db.SaveChangesAsync();
        }
        catch
        {
            if (File.Exists(absolutePath))
                File.Delete(absolutePath);
            throw new ApiException(HttpStatusCode.BadRequest, "Failed to upload task attachment.");
        }

        return new Response<TaskAttachmentDto>("Task attachment uploaded.",
            await GetTaskAttachmentByIdAsync(workspaceId, projectId, taskId, taskAttachment.Id).TryGetDataAsync());
    }

    public async Task<(Stream Stream, string FileName, string ContentType)> DownloadTaskAttachmentAsync(
        Guid workspaceId, Guid projectId, Guid taskId, Guid attachmentId)
    {
        var attachment = await db.TaskAttachments
                             .SingleOrDefaultAsync(o =>
                                 o.Id == attachmentId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                                 o.Task.Section.Project.WorkspaceId == workspaceId)
                         ?? throw new ApiException(HttpStatusCode.NotFound, "Attachment not found.");

        var relativePath = attachment.StorageKey.Replace("/", Path.DirectorySeparatorChar.ToString());
        var absolutePath = storageService.GetPrivatePath(relativePath);

        if (!File.Exists(absolutePath))
            throw new ApiException(HttpStatusCode.NotFound, "Attachment file not found.");

        Stream stream = new FileStream(absolutePath, FileMode.Open, FileAccess.Read, FileShare.Read);

        return (stream, attachment.FileName, attachment.ContentType);
    }

    public async Task<Response> DeleteTaskAttachmentAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid attachmentId)
    {
        var attachment =
            await db.TaskAttachments.SingleOrDefaultAsync(o =>
                o.Id == attachmentId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                o.Task.Section.Project.WorkspaceId == workspaceId) ??
            throw new ApiException(HttpStatusCode.NotFound, "Attachment not found.");

        attachment.DeletedAt = DateTimeOffset.UtcNow;
        attachment.DeletedBy = accessor.GetUserId();

        var relativePath = attachment.StorageKey.Replace("/", Path.DirectorySeparatorChar.ToString());
        var absolutePath = storageService.GetPrivatePath(relativePath);

        if (File.Exists(absolutePath))
            File.Delete(absolutePath);

        await db.SaveChangesAsync();
        return new Response("Task attachment deleted.");
    }

    #endregion


    #region Subtasks

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
        SubtaskDto dto)
    {
        var taskExists = await db.Tasks.AnyAsync(o =>
            o.Id == taskId && o.Section.ProjectId == projectId && o.Section.Project.WorkspaceId == workspaceId);
        if (!taskExists)
            throw new ApiException(HttpStatusCode.NotFound, "Task not found.");

        var subtask = new Subtask
        {
            TaskId = taskId,
            Name = dto.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Subtasks.Add(subtask);

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask created.",
            await GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtask.Id).TryGetDataAsync());
    }

    public async Task<Response<SubtaskDto>> UpdateSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId, SubtaskDto dto)
    {
        var subtask = await db.Subtasks.SingleOrDefaultAsync(o =>
                          o.Id == subtaskId && o.TaskId == taskId && o.Task.Section.ProjectId == projectId &&
                          o.Task.Section.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Subtask not found");

        subtask.Name = dto.Name;
        subtask.UpdatedAt = DateTimeOffset.UtcNow;
        subtask.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SubtaskDto>("Subtask updated.",
            await GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtaskId).TryGetDataAsync());
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

    #endregion
}