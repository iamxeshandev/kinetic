using kinetic_api.Dtos.Project;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class ProjectsController(ProjectService projectService) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult> GetAllProjectsAsync()
    {
        return Ok(await projectService.GetAllProjectsAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetProjectByIdAsync(Guid id)
    {
        return Ok(await projectService.GetProjectByIdAsync(id));
    }

    [HttpPost("")]
    public async Task<ActionResult> CreateProjectAsync(ProjectDto dto)
    {
        var result = await projectService.CreateProjectAsync(dto);
        return CreatedAtAction(nameof(GetProjectByIdAsync), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateProjectAsync(Guid id, ProjectDto dto)
    {
        return Ok(await projectService.UpdateProjectAsync(id, dto));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteProjectAsync(Guid id)
    {
        return Ok(await projectService.DeleteProjectAsync(id));
    }
}