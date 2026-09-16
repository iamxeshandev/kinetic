using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.User;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize(Policy = "NonPersonalWorkspaceMember")]
[Route("api/workspaces/{workspaceId:guid}/[controller]")]
public class UsersController(UserService service) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult<Response<List<UserDto>>>> GetAllUsersAsync(Guid workspaceId)
    {
        return await service.GetAllUsersAsync(workspaceId);
    }

    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<Response<UserDto>>> GetUserByIdAsync(Guid workspaceId, Guid userId)
    {
        return await service.GetUserByIdAsync(workspaceId, userId);
    }

    [Authorize(Policy = "WorkspaceManager")]
    [HttpPost("")]
    public async Task<ActionResult<Response<UserDto>>> CreateUserAsync(Guid workspaceId, UserRequest request)
    {
        return Created("", await service.CreateUserAsync(workspaceId, request));
    }

    [Authorize(Policy = "WorkspaceManager")]
    [HttpPut("{userId:guid}")]
    public async Task<ActionResult<Response<UserDto>>> UpdateUserAsync(Guid workspaceId, Guid userId,
        UserRequest request)
    {
        return await service.UpdateUserAsync(workspaceId, userId, request);
    }

    [Authorize(Policy = "WorkspaceManager")]
    [HttpDelete("{userId:guid}")]
    public async Task<ActionResult<Response>> DeleteUserAsync(Guid workspaceId, Guid userId)
    {
        return await service.DeleteUserAsync(workspaceId, userId);
    }
}