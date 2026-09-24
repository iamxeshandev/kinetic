using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.TaskType;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/task-types")]
public class TaskTypesController(TaskTypeService service) : ControllerBase
{
    [HttpGet]
    [EndpointName("GetTaskTypes")]
    public async Task<ActionResult<Response<TaskTypeDto[]>>> GetAllTaskTypesAsync(Guid workspaceId, Guid projectId)
    {
        return await service.GetAllTaskTypesAsync(workspaceId, projectId);
    }

    [HttpGet("{taskTypeId:guid}")]
    [EndpointName("GetTaskType")]
    public async Task<ActionResult<Response<TaskTypeDto>>> GetTaskTypeAsync(Guid workspaceId, Guid projectId,
        Guid taskTypeId)
    {
        return await service.GetTaskTypeByIdAsync(workspaceId, projectId, taskTypeId);
    }

    [HttpPost]
    [EndpointName("CreateTaskType")]
    public async Task<ActionResult<Response<TaskTypeDto>>> CreateTaskTypeAsync(Guid workspaceId, Guid projectId,
        TaskTypeRequest request)
    {
        return Created("", await service.CreateTaskTypeAsync(workspaceId, projectId, request));
    }

    [HttpPut("{taskTypeId:guid}")]
    [EndpointName("UpdateTaskType")]
    public async Task<ActionResult<Response<TaskTypeDto>>> UpdateTaskTypeAsync(Guid workspaceId, Guid projectId,
        Guid taskTypeId,
        TaskTypeRequest request)
    {
        return await service.UpdateTaskTypeAsync(workspaceId, projectId, taskTypeId, request);
    }

    [HttpDelete("{taskTypeId:guid}")]
    [EndpointName("DeleteTaskType")]
    public async Task<ActionResult<Response>> DeleteTaskTypeAsync(Guid workspaceId, Guid projectId, Guid taskTypeId)
    {
        return await service.DeleteTaskTypeAsync(workspaceId, projectId, taskTypeId);
    }
}