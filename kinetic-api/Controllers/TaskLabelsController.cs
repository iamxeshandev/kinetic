using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskLabel;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/task-labels")]
public class TaskLabelsController(TaskLabelService service) : ControllerBase
{
    [HttpGet]
    [EndpointName("GetTaskLabels")]
    public async Task<ActionResult<Response<TaskLabelDto[]>>> GetAllTaskLabelsAsync(Guid workspaceId, Guid projectId)
    {
        return await service.GetAllTaskLabelsAsync(workspaceId, projectId);
    }

    [HttpGet("{taskTypeId:guid}")]
    [EndpointName("GetTaskLabel")]
    public async Task<ActionResult<Response<TaskLabelDto>>> GetTaskLabelAsync(Guid workspaceId, Guid projectId,
        Guid taskTypeId)
    {
        return await service.GetTaskLabelByIdAsync(workspaceId, projectId, taskTypeId);
    }

    [HttpPost]
    [EndpointName("CreateTaskLabel")]
    public async Task<ActionResult<Response<TaskLabelDto>>> CreateTaskLabelAsync(Guid workspaceId, Guid projectId,
        TaskLabelRequest request)
    {
        return Created("", await service.CreateTaskLabelAsync(workspaceId, projectId, request));
    }

    [HttpPut("{taskTypeId:guid}")]
    [EndpointName("UpdateTaskLabel")]
    public async Task<ActionResult<Response<TaskLabelDto>>> UpdateTaskLabelAsync(Guid workspaceId, Guid projectId,
        Guid taskTypeId,
        TaskLabelRequest request)
    {
        return await service.UpdateTaskLabelAsync(workspaceId, projectId, taskTypeId, request);
    }

    [HttpDelete("{taskTypeId:guid}")]
    [EndpointName("DeleteTaskLabel")]
    public async Task<ActionResult<Response>> DeleteTaskLabelAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        return await service.DeleteTaskLabelAsync(workspaceId, projectId, taskTypeId);
    }
}