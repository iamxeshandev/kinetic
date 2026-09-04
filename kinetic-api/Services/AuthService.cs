using System.Net;
using System.Security.Claims;
using kinetic_api.Database;
using kinetic_api.Dtos.Auth;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Workspace;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    AppDbContext db)
{
    public async Task<Response> RegisterAsync(RegisterDto registerDto)
    {
        var existedUser = await userManager.FindByEmailAsync(registerDto.Email);
        if (existedUser is not null)
            throw new ApiException(HttpStatusCode.BadRequest, "Email already exists.");

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = registerDto.Email.ToLower(),
            Email = registerDto.Email.ToLower(),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName
        };

        var workspace = new Workspace
        {
            Name = "Personal Workspace",
            IsPersonal = true,
            CreatedBy = user.Id
        };
        db.Workspaces.Add(workspace);

        var member = new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = user.Id,
            Role = EWorkspaceRole.Owner,
            CreatedBy = user.Id
        };
        db.WorkspaceMembers.Add(member);

        user.CurrentWorkspaceId = workspace.Id;

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.BadRequest, "User creation failed.");

        await db.SaveChangesAsync();
        return new Response("Registered successfully.");
    }

    public async Task<Response<LoginResponseDto>> LoginAsync(LoginDto loginDto)
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

        var workspaceDto = user.CurrentWorkspaceId.HasValue
            ? await db.WorkspaceMembers
                .Where(o => o.WorkspaceId == user.CurrentWorkspaceId.Value && o.UserId == user.Id)
                .Select(o => new WorkspaceDto(
                    o.WorkspaceId,
                    o.Workspace.Name,
                    o.Role,
                    o.Workspace.IsPersonal,
                    db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
                ))
                .SingleOrDefaultAsync()
            : null;

        var dto = new LoginResponseDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.FullName,
            workspaceDto
        );

        return new Response<LoginResponseDto>(dto);
    }

    public async Task<Response> LogoutAsync()
    {
        await signInManager.SignOutAsync();
        return new Response("Logged out successfully.");
    }

    public async Task<Response<LoginResponseDto?>> GetMeAsync(ClaimsPrincipal currentUser)
    {
        if (currentUser.Identity is null || !currentUser.Identity.IsAuthenticated ||
            currentUser.FindFirstValue(ClaimTypes.NameIdentifier) is not { } userId ||
            await userManager.FindByIdAsync(userId) is not { } user)
            return new Response<LoginResponseDto?>(null);

        var workspaceDto = user.CurrentWorkspaceId.HasValue
            ? await db.WorkspaceMembers
                .Where(o => o.WorkspaceId == user.CurrentWorkspaceId.Value && o.UserId == user.Id)
                .Select(o => new WorkspaceDto(
                    o.WorkspaceId,
                    o.Workspace.Name,
                    o.Role,
                    o.Workspace.IsPersonal,
                    db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
                ))
                .SingleOrDefaultAsync()
            : null;

        var dto = new LoginResponseDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.FullName,
            workspaceDto
        );

        return new Response<LoginResponseDto?>(dto);
    }
}