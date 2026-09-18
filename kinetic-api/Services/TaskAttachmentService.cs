using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class TaskAttachmentService(AppDbContext db, IHttpContextAccessor accessor, StorageService storageService)
{
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
            await GetTaskAttachmentByIdAsync(workspaceId, projectId, taskId, taskAttachment.Id).GetDataAsync());
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
}