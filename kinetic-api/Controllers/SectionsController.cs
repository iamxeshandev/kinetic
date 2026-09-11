using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Section;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/projects/{projectId:guid}/sections")]
public class SectionsController(SectionService service) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult<Response<List<SectionDto>>>> GetAllSectionsAsync(Guid workspaceId, Guid projectId)
    {
        return Ok(await service.GetAllSectionsAsync(workspaceId, projectId));
    }

    [HttpGet("{sectionId:guid}")]
    public async Task<ActionResult<Response<SectionDto>>> GetSectionByIdAsync(Guid workspaceId, Guid projectId,
        Guid sectionId)
    {
        return Ok(await service.GetSectionByIdAsync(workspaceId, projectId, sectionId));
    }

    [HttpPost("")]
    public async Task<ActionResult<Response<SectionDto>>> CreateSectionAsync(Guid workspaceId, Guid projectId,
        SectionDto dto)
    {
        return Created("", await service.CreateSectionAsync(workspaceId, projectId, dto));
    }

    [HttpPut("{sectionId:guid}")]
    public async Task<ActionResult<Response<SectionDto>>> UpdateSectionAsync(Guid workspaceId, Guid projectId,
        Guid sectionId, SectionDto dto)
    {
        return Ok(await service.UpdateSectionAsync(workspaceId, projectId, sectionId, dto));
    }

    [HttpDelete("{sectionId:guid}")]
    public async Task<ActionResult<Response<SectionDto>>> DeleteSectionAsync(Guid workspaceId, Guid projectId,
        Guid sectionId, [FromQuery] Guid? moveTasksTo, [FromQuery] bool deleteTasks)
    {
        return Ok(await service.DeleteSectionAsync(workspaceId, projectId, sectionId, moveTasksTo, deleteTasks));
    }

    [HttpPatch("{sectionId:guid}/move")]
    public async Task<ActionResult<Response<SectionDto>>> MoveSectionAsync(Guid workspaceId, Guid projectId,
        Guid sectionId, MoveSectionDto dto)
    {
        return Ok(await service.MoveSectionAsync(workspaceId, projectId, sectionId, dto));
    }
}