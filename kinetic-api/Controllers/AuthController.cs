using kinetic_api.Dtos.Auth;
using kinetic_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync(RegisterDto registerDto)
    {
        return Ok(await authService.RegisterAsync(registerDto));
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginAsync(LoginDto loginDto)
    {
        return Ok(await authService.LoginAsync(loginDto));
    }

    [HttpPost("logout")]
    public async Task<ActionResult> LogoutAsync()
    {
        return Ok(await authService.LogoutAsync());
    }

    [HttpGet("me")]
    public async Task<ActionResult> GetMeAsync()
    {
        return Ok(await authService.GetMeAsync(HttpContext.User));
    }
}