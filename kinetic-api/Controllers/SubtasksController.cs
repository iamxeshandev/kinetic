using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/tasks/{taskId:guid}/subtasks")]
public class SubtasksController(SubtaskService service) : ControllerBase
{
    [HttpGet]
    [EndpointName("GetSubtasks")]
    public async Task<ActionResult<Response<List<SubtaskDto>>>> GetAllSubtasksAsync(Guid workspaceId, Guid projectId,
        Guid taskId)
    {
        return await service.GetAllSubtasksAsync(workspaceId, projectId, taskId);
    }

    [HttpGet("{subtaskId:guid}")]
    [EndpointName("GetSubtask")]
    public async Task<ActionResult<Response<SubtaskDto>>> GetSubtaskByIdAsync(Guid workspaceId, Guid projectId,
        Guid taskId, Guid subtaskId)
    {
        return await service.GetSubtaskByIdAsync(workspaceId, projectId, taskId, subtaskId);
    }

    [HttpPost]
    [EndpointName("CreateSubtask")]
    public async Task<ActionResult<Response<SubtaskDto>>> CreateSubtaskAsync(Guid workspaceId, Guid projectId,
        Guid taskId, SubtaskRequest request)
    {
        return Created("", await service.CreateSubtaskAsync(workspaceId, projectId, taskId, request));
    }

    [HttpPut("{subtaskId:guid}")]
    [EndpointName("UpdateSubtask")]
    public async Task<ActionResult<Response<SubtaskDto>>> UpdateSubtaskAsync(Guid workspaceId, Guid projectId,
        Guid taskId, Guid subtaskId, SubtaskRequest request)
    {
        return await service.UpdateSubtaskAsync(workspaceId, projectId, taskId, subtaskId, request);
    }

    [HttpDelete("{subtaskId:guid}")]
    [EndpointName("DeleteSubtask")]
    public async Task<ActionResult<Response>> DeleteSubtaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        Guid subtaskId)
    {
        return await service.DeleteSubtaskAsync(workspaceId, projectId, taskId, subtaskId);
    }
}