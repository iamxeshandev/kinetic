using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/tasks/{taskId:guid}/attachments")]
public class TaskAttachmentsController(TaskAttachmentService service) : ControllerBase
{
    [HttpGet]
    [EndpointName("GetTaskAttachments")]
    public async Task<ActionResult<Response<List<TaskAttachmentDto>>>> GetAllTaskAttachmentsAsync(Guid workspaceId,
        Guid projectId, Guid taskId)
    {
        return await service.GetAllTaskAttachmentsAsync(workspaceId, projectId, taskId);
    }

    [HttpGet("{attachmentId:guid}")]
    [EndpointName("GetTaskAttachment")]
    public async Task<ActionResult<Response<TaskAttachmentDto>>> GetTaskAttachmentByIdAsync(Guid workspaceId,
        Guid projectId, Guid taskId, Guid attachmentId)
    {
        return await service.GetTaskAttachmentByIdAsync(workspaceId, projectId, taskId, attachmentId);
    }

    [HttpPost]
    [EndpointName("UploadTaskAttachment")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<Response<TaskAttachmentDto>>> UploadTaskAttachmentAsync(Guid workspaceId,
        Guid projectId, Guid taskId, [FromForm] FileUploadRequest request)
    {
        return Created("", await service.UploadTaskAttachmentAsync(workspaceId, projectId, taskId, request));
    }

    [HttpGet("{attachmentId:guid}/download")]
    [EndpointName("DownloadTaskAttachment")]
    public async Task<ActionResult> DownloadTaskAttachmentAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid attachmentId)
    {
        var file = await service.DownloadTaskAttachmentAsync(workspaceId, projectId, taskId, attachmentId);

        return File(file.Stream, file.ContentType, file.FileName, true);
    }

    [HttpDelete("{attachmentId:guid}")]
    [EndpointName("DeleteTaskAttachment")]
    public async Task<ActionResult<Response>> DeleteTaskAttachmentAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid attachmentId)
    {
        return await service.DeleteTaskAttachmentAsync(workspaceId, projectId, taskId, attachmentId);
    }
}