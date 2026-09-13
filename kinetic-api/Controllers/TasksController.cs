using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Task;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize(Policy = "WorkspaceMember")]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/[controller]")]
public class TasksController(TaskService service) : ControllerBase
{
    // Tasks
    [HttpGet("")]
    public async Task<ActionResult<Response<List<TaskDto>>>> GetAllTasksAsync(Guid workspaceId, Guid projectId)
    {
        return await service.GetAllTasksAsync(workspaceId, projectId);
    }

    [HttpGet("{taskId:guid}")]
    public async Task<ActionResult<Response<TaskDto>>> GetTaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        return await service.GetTaskByIdAsync(workspaceId, projectId, taskId);
    }

    [HttpPost("")]
    public async Task<ActionResult<Response<TaskDto>>> CreateTaskAsync(Guid workspaceId, Guid projectId, TaskDto dto)
    {
        return Created("", await service.CreateTaskAsync(workspaceId, projectId, dto));
    }

    [HttpPut("{taskId:guid}")]
    public async Task<ActionResult<Response<TaskDto>>> UpdateTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        TaskDto dto)
    {
        return await service.UpdateTaskAsync(workspaceId, projectId, taskId, dto);
    }

    [HttpPatch("{taskId:guid}/move")]
    public async Task<ActionResult<Response>> MoveTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        MoveTaskDto dto)
    {
        return await service.MoveTaskAsync(workspaceId, projectId, taskId, dto);
    }

    [HttpDelete("{taskId:guid}")]
    public async Task<ActionResult<Response>> DeleteTaskAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        return await service.DeleteTaskAsync(workspaceId, projectId, taskId);
    }


    // Task Attachments
    [HttpGet("{taskId:guid}/attachments")]
    public async Task<ActionResult<Response<List<TaskAttachmentDto>>>> GetAllTaskAttachmentsAsync(Guid workspaceId,
        Guid projectId, Guid taskId)
    {
        return await service.GetAllTaskAttachmentsAsync(workspaceId, projectId, taskId);
    }

    [HttpGet("{taskId:guid}/attachments/{attachmentId:guid}")]
    public async Task<ActionResult<Response<TaskAttachmentDto>>> GetTaskAttachmentByIdAsync(Guid workspaceId,
        Guid projectId, Guid taskId, Guid attachmentId)
    {
        return await service.GetTaskAttachmentByIdAsync(workspaceId, projectId, taskId, attachmentId);
    }

    [HttpPost("{taskId:guid}/attachments")]
    public async Task<ActionResult<Response<TaskAttachmentDto>>> UploadTaskAttachmentAsync(Guid workspaceId,
        Guid projectId, Guid taskId, [FromForm] IFormFile file)
    {
        return Created("", await service.UploadTaskAttachmentAsync(workspaceId, projectId, taskId, file));
    }

    [HttpGet("{taskId:guid}/attachments/{attachmentId:guid}/download")]
    public async Task<ActionResult> DownloadTaskAttachmentAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid attachmentId)
    {
        var file = await service.DownloadTaskAttachmentAsync(workspaceId, projectId, taskId, attachmentId);

        return File(file.Stream, file.ContentType, file.FileName, true);
    }

    [HttpDelete("{taskId:guid}/attachments/{attachmentId:guid}")]
    public async Task<ActionResult<Response>> DeleteTaskAttachmentAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid attachmentId)
    {
        return await service.DeleteTaskAttachmentAsync(workspaceId, projectId, taskId, attachmentId);
    }


    // Subtasks
    [HttpGet("{taskId:guid}/subtasks")]
    public async Task<ActionResult<Response<List<SubtaskDto>>>> GetAllSubtasksAsync(Guid workspaceId, Guid projectId,
        Guid taskId)
    {
        return await service.GetAllSubtasksAsync(workspaceId, projectId, taskId);
    }

    [HttpGet("{taskId:guid}/subtasks/{subtaskId:guid}")]
    public async Task<ActionResult<Response<SubtaskDto>>> GetSubtaskByIdAsync(Guid workspaceId, Guid projectId,
        Guid taskId, Guid subtaskId)
    {
        return await service.GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtaskId);
    }

    [HttpPost("{taskId:guid}/subtasks")]
    public async Task<ActionResult<Response<SubtaskDto>>> CreateSubtaskAsync(Guid workspaceId, Guid projectId,
        Guid taskId, SubtaskDto dto)
    {
        return Created("", await service.CreateSubtaskAsync(workspaceId, projectId, taskId, dto));
    }

    [HttpPut("{taskId:guid}/subtasks/{subtaskId:guid}")]
    public async Task<ActionResult<Response<SubtaskDto>>> UpdateSubtaskAsync(Guid workspaceId, Guid projectId,
        Guid taskId, Guid subtaskId, SubtaskDto dto)
    {
        return await service.UpdateSubtaskAsync(workspaceId, projectId, taskId, subtaskId, dto);
    }

    [HttpDelete("{taskId:guid}/subtasks/{subtaskId:guid}")]
    public async Task<ActionResult<Response>> DeleteSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId)
    {
        return await service.DeleteSubtaskAsync(workspaceId, projectId, taskId, subtaskId);
    }
}