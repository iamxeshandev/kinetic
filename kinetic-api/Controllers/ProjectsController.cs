using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/[controller]")]
public class ProjectsController(ProjectService projectService) : ControllerBase
{
    [Authorize(Policy = "WorkspaceMember")]
    [HttpGet("")]
    public async Task<ActionResult<Response<List<ProjectDto>>>> GetAllProjectsAsync(Guid workspaceId)
    {
        return await projectService.GetAllProjectsAsync(workspaceId);
    }

    [Authorize(Policy = "WorkspaceMember")]
    [HttpGet("{projectId:guid}")]
    public async Task<ActionResult<Response<ProjectDto>>> GetProjectByIdAsync(Guid workspaceId, Guid projectId)
    {
        return await projectService.GetProjectByIdAsync(workspaceId, projectId);
    }

    [Authorize(Policy = "WorkspaceManager")]
    [HttpPost("")]
    public async Task<ActionResult<Response<ProjectDto>>> CreateProjectAsync(Guid workspaceId, ProjectDto dto)
    {
        return Created("", await projectService.CreateProjectAsync(workspaceId, dto));
    }

    [Authorize(Policy = "WorkspaceAdminOrProjectLead")]
    [HttpPut("{projectId:guid}")]
    public async Task<ActionResult<Response<ProjectDto>>> UpdateProjectAsync(Guid workspaceId, Guid projectId,
        ProjectDto dto)
    {
        return await projectService.UpdateProjectAsync(workspaceId, projectId, dto);
    }

    [Authorize(Policy = "WorkspaceAdminOrProjectOwner")]
    [HttpDelete("{projectId:guid}")]
    public async Task<ActionResult<Response>> DeleteProjectAsync(Guid workspaceId, Guid projectId)
    {
        return await projectService.DeleteProjectAsync(workspaceId, projectId);
    }

    [Authorize(Policy = "WorkspaceManagerOrProjectLead")]
    [HttpGet("{projectId:guid}/members")]
    public async Task<ActionResult<Response<List<ProjectMemberDto>>>> GetProjectMembersAsync(Guid workspaceId,
        Guid projectId)
    {
        return await projectService.GetProjectMembersAsync(workspaceId, projectId);
    }
}