using kinetic_api.Dtos.Auth;
using kinetic_api.Dtos.Common;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [EndpointName("Register")]
    public async Task<ActionResult<Response>> RegisterAsync(RegisterRequest request)
    {
        return Created("", await authService.RegisterAsync(request));
    }

    [HttpPost("login")]
    [EndpointName("Login")]
    public async Task<ActionResult<Response<MeDto>>> LoginAsync(LoginRequest request)
    {
        return await authService.LoginAsync(request);
    }

    [HttpPost("logout")]
    [EndpointName("Logout")]
    public async Task<ActionResult<Response>> LogoutAsync()
    {
        return await authService.LogoutAsync();
    }

    [HttpPatch("switch/{workspaceId:guid}")]
    [Authorize]
    [EndpointName("Switch")]
    public async Task<ActionResult<Response<MeDto>>> SwitchAsync(Guid workspaceId)
    {
        return await authService.SwitchAsync(workspaceId);
    }

    [HttpGet("me")]
    [EndpointName("GetMe")]
    public async Task<ActionResult<Response<MeDto?>>> GetMeAsync()
    {
        return await authService.GetMeAsync();
    }

    [HttpPost("me")]
    [Authorize]
    [EndpointName("UpdateMe")]
    public async Task<ActionResult<Response<MeDto>>> UpdateMeAsync(MeRequest request)
    {
        return await authService.UpdateMeAsync(request);
    }

    [HttpPost("me/avatar")]
    [Authorize]
    [EndpointName("UploadAvatar")]
    public async Task<ActionResult<Response<string>>> UploadAvatarAsync(IFormFile avatar)
    {
        return await authService.UploadAvatarAsync(avatar, HttpContext.User);
    }
}