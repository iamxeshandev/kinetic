using kinetic_api.Dtos.Auth;
using kinetic_api.Dtos.Common;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<Response>> RegisterAsync(RegisterDto registerDto)
    {
        return Created("", await authService.RegisterAsync(registerDto));
    }

    [HttpPost("login")]
    public async Task<ActionResult<Response<MeDto>>> LoginAsync(LoginDto loginDto)
    {
        return await authService.LoginAsync(loginDto);
    }

    [HttpPost("logout")]
    public async Task<ActionResult<Response>> LogoutAsync()
    {
        return await authService.LogoutAsync();
    }

    [HttpPatch("switch/{workspaceId:guid}")]
    [Authorize]
    public async Task<ActionResult<Response<MeDto>>> SwitchAsync(Guid workspaceId)
    {
        return await authService.SwitchAsync(workspaceId);
    }

    [HttpGet("me")]
    public async Task<ActionResult<Response<MeDto?>>> GetMeAsync()
    {
        return await authService.GetMeAsync();
    }

    [HttpPost("me")]
    [Authorize]
    public async Task<ActionResult<Response<MeDto>>> UpdateMeAsync(MeDto dto)
    {
        return await authService.UpdateMeAsync(dto);
    }

    [HttpPost("me/avatar")]
    [Authorize]
    public async Task<ActionResult<Response<string>>> UploadAvatarAsync(IFormFile avatar)
    {
        return await authService.UploadAvatarAsync(avatar, HttpContext.User);
    }
}