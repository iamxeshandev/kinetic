using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class LookupsController : ControllerBase
{
    [HttpGet("priorities")]
    public ActionResult<Response<List<LookupDto<EPriority>>>> GetPriorities()
    {
        var lookups = Enum.GetValues<EPriority>()
            .Select(o => new LookupDto<EPriority>(o, o.GetDisplayName()))
            .ToList();

        return new Response<List<LookupDto<EPriority>>>(lookups);
    }

    [HttpGet("project-roles")]
    public ActionResult<Response<List<LookupDto<EProjectRole>>>> GetProjectRoles()
    {
        var lookups = Enum.GetValues<EProjectRole>()
            .Select(o => new LookupDto<EProjectRole>(o, o.GetDisplayName()))
            .ToList();

        return new Response<List<LookupDto<EProjectRole>>>(lookups);
    }

    [HttpGet("project-statuses")]
    public ActionResult<Response<List<LookupDto<EProjectStatus>>>> GetProjectStatuses()
    {
        var lookups = Enum.GetValues<EProjectStatus>()
            .Select(o => new LookupDto<EProjectStatus>(o, o.GetDisplayName()))
            .ToList();

        return new Response<List<LookupDto<EProjectStatus>>>(lookups);
    }

    [HttpGet("workspace-roles")]
    public ActionResult<Response<List<LookupDto<EWorkspaceRole>>>> GetWorkspaceRoles()
    {
        var lookups = Enum.GetValues<EWorkspaceRole>()
            .Select(o => new LookupDto<EWorkspaceRole>(o, o.GetDisplayName()))
            .ToList();

        return new Response<List<LookupDto<EWorkspaceRole>>>(lookups);
    }
}