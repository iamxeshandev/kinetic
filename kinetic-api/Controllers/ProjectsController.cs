using kinetic_api.dtos;
using kinetic_api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectsController(ProjectService projectService) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult> GetAll()
    {
        return Ok(await projectService.GetAllProjectsAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        return Ok(await projectService.GetProjectByIdAsync(id));
    }

    [HttpPost("")]
    public async Task<ActionResult> Create(ProjectDto dto)
    {
        var result = await projectService.CreateProjectAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, ProjectDto dto)
    {
        return Ok(await projectService.UpdateProjectAsync(id, dto));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        return Ok(await projectService.DeleteProjectAsync(id));
    }
}