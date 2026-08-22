using System.Net;
using System.Security.Claims;
using kinetic_api.Dtos.Auth;
using kinetic_api.Dtos.Common;
using kinetic_api.Exceptions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity;

namespace kinetic_api.Services;

public class AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
{
    public async Task<Response> RegisterAsync(RegisterDto registerDto)
    {
        var existedUser = await userManager.FindByEmailAsync(registerDto.Email);
        if (existedUser is not null)
            throw new ApiException(HttpStatusCode.BadRequest, "Email already exists.");

        var user = new ApplicationUser
        {
            UserName = registerDto.Email.ToLower(),
            Email = registerDto.Email.ToLower(),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.BadRequest, "User creation failed.");

        return new Response("Registered successfully.");
    }

    public async Task<Response<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user is null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid credentials.");

        var result = await signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password,
            loginDto.RememberMe,
            false
        );
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.Unauthorized, "Invalid credentials.");

        var dto = new AuthResponseDto(user.Id, user.UserName!, user.FirstName, user.LastName);

        return new Response<AuthResponseDto>("Logged in successfully.", dto);
    }

    public async Task<Response> LogoutAsync()
    {
        await signInManager.SignOutAsync();
        return new Response("Logged out successfully.");
    }

    public async Task<Response<AuthResponseDto?>> GetMeAsync(ClaimsPrincipal currentUser)
    {
        ApplicationUser? user = null;
        if (currentUser.Identity!.IsAuthenticated)
            user = await userManager.FindByIdAsync(
                currentUser.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty);

        var dto = user is null ? null : new AuthResponseDto(user.Id, user.Email!, user.FirstName, user.LastName);
        return new Response<AuthResponseDto?>(dto);
    }
}