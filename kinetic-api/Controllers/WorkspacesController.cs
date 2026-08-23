using kinetic_api.Dtos.Workspace;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class WorkspacesController(WorkspaceService workspaceService) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult> GetAllWorkspaces()
    {
        return Ok(await workspaceService.GetAllWorkspaces());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetWorkspaceByIdAsync(Guid id)
    {
        return Ok(await workspaceService.GetWorkspaceByIdAsync(id));
    }

    [HttpPost("")]
    public async Task<ActionResult> CreateWorkspaceAsync(WorkspaceDto dto)
    {
        var result = await workspaceService.CreateWorkspaceAsync(dto);
        return CreatedAtAction(nameof(GetWorkspaceByIdAsync), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateWorkspaceAsync(Guid id, WorkspaceDto dto)
    {
        return Ok(await workspaceService.UpdateWorkspaceAsync(id, dto));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteWorkspaceAsync(Guid id)
    {
        return Ok(await workspaceService.DeleteWorkspaceAsync(id));
    }
}