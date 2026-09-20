using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Task;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize(Policy = "WorkspaceMember")]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/tasks")]
public class TasksController(TaskService service) : ControllerBase
{
    [HttpGet]
    [EndpointName("GetTasks")]
    public async Task<ActionResult<Response<List<TaskDto>>>> GetAllTasksAsync(Guid workspaceId, Guid projectId)
    {
        return await service.GetAllTasksAsync(workspaceId, projectId);
    }

    [HttpGet("{taskId:guid}")]
    [EndpointName("GetTask")]
    public async Task<ActionResult<Response<TaskDto>>> GetTaskByIdAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        return await service.GetTaskByIdAsync(workspaceId, projectId, taskId);
    }

    [HttpPost]
    [EndpointName("CreateTask")]
    public async Task<ActionResult<Response<TaskDto>>> CreateTaskAsync(Guid workspaceId, Guid projectId,
        TaskRequest request)
    {
        return Created("", await service.CreateTaskAsync(workspaceId, projectId, request));
    }

    [HttpPut("{taskId:guid}")]
    [EndpointName("UpdateTask")]
    public async Task<ActionResult<Response<TaskDto>>> UpdateTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        TaskRequest request)
    {
        return await service.UpdateTaskAsync(workspaceId, projectId, taskId, request);
    }

    [HttpPatch("{taskId:guid}/move")]
    [EndpointName("MoveTask")]
    public async Task<ActionResult<Response<TaskDto>>> MoveTaskAsync(Guid workspaceId, Guid projectId, Guid taskId,
        MoveTaskRequest request)
    {
        return await service.MoveTaskAsync(workspaceId, projectId, taskId, request);
    }

    [HttpDelete("{taskId:guid}")]
    [EndpointName("DeleteTask")]
    public async Task<ActionResult<Response>> DeleteTaskAsync(Guid workspaceId, Guid projectId, Guid taskId)
    {
        return await service.DeleteTaskAsync(workspaceId, projectId, taskId);
    }
}