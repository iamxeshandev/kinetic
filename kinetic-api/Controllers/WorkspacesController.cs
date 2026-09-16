using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Workspace;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WorkspacesController(WorkspaceService workspaceService) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult<Response<List<WorkspaceDto>>>> GetAllWorkspacesAsync()
    {
        return await workspaceService.GetAllWorkspacesAsync();
    }

    [Authorize(Policy = "WorkspaceMember")]
    [HttpGet("{workspaceId:guid}")]
    public async Task<ActionResult<Response<WorkspaceDto>>> GetWorkspaceByIdAsync(Guid workspaceId)
    {
        return await workspaceService.GetWorkspaceByIdAsync(workspaceId);
    }

    [HttpPost("")]
    public async Task<ActionResult<Response<WorkspaceDto>>> CreateWorkspaceAsync(WorkspaceRequest request)
    {
        return Created("", await workspaceService.CreateWorkspaceAsync(request));
    }

    [Authorize(Policy = "WorkspaceAdmin")]
    [HttpPut("{workspaceId:guid}")]
    public async Task<ActionResult<Response<WorkspaceDto>>> UpdateWorkspaceAsync(Guid workspaceId,
        WorkspaceRequest request)
    {
        return await workspaceService.UpdateWorkspaceAsync(workspaceId, request);
    }

    [Authorize(Policy = "WorkspaceOwner")]
    [HttpDelete("{workspaceId:guid}")]
    public async Task<ActionResult<Response>> DeleteWorkspaceAsync(Guid workspaceId)
    {
        return await workspaceService.DeleteWorkspaceAsync(workspaceId);
    }
}