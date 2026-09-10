using System.Net;
using System.Security.Claims;
using kinetic_api.Data;
using kinetic_api.Dtos.Auth;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Workspace;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    StorageService storageService,
    AppDbContext db,
    IHttpContextAccessor accessor)
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

    public async Task<Response<MeDto>> LoginAsync(LoginDto loginDto)
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

        var dto = new MeDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.AvatarKey.ToPublicUrl(),
            workspaceDto
        );

        return new Response<MeDto>(dto);
    }

    public async Task<Response> LogoutAsync()
    {
        await signInManager.SignOutAsync();
        return new Response("Logged out successfully.");
    }


    public async Task<Response<MeDto>> SwitchAsync(Guid workspaceId)
    {
        var userId = accessor.GetUserId();

        var workspaceDto = await db.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == userId)
            .Select(o => new WorkspaceDto(
                o.WorkspaceId,
                o.Workspace.Name,
                o.Role,
                o.Workspace.IsPersonal,
                db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
            ))
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        var user = await userManager.FindByIdAsync(userId.ToString()) ??
                   throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        user.CurrentWorkspaceId = workspaceDto.Id;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.InternalServerError, "Something went wrong. Try again later.");

        var dto = new MeDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.AvatarKey.ToPublicUrl(),
            workspaceDto
        );

        return new Response<MeDto>(dto);
    }


    public async Task<Response<MeDto?>> GetMeAsync()
    {
        if (accessor.HttpContext?.User.Identity is null ||
            !accessor.HttpContext.User.Identity.IsAuthenticated ||
            accessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) is not { } userId ||
            await userManager.FindByIdAsync(userId) is not { } user)
            return new Response<MeDto?>(null);

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

        var dto = new MeDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.AvatarKey,
            workspaceDto
        );

        return new Response<MeDto?>(dto);
    }

    public async Task<Response<MeDto>> UpdateMeAsync(MeDto dto)
    {
        var userId = accessor.GetUserId();

        var user = await userManager.FindByIdAsync(userId.ToString()) ?? throw new UnauthorizedAccessException();
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.BadRequest, "Could not update user.");

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

        return new Response<MeDto>("User updated.", new MeDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.AvatarKey.ToPublicUrl(),
            workspaceDto
        ));
    }

    public async Task<Response<string>> UploadAvatarAsync(IFormFile file, ClaimsPrincipal currentUser)
    {
        if (!Guid.TryParse(currentUser.FindFirstValue(ClaimTypes.NameIdentifier) ?? "", out var userId))
            throw new UnauthorizedAccessException();

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            throw new UnauthorizedAccessException();

        if (file.Length == 0)
            throw new ApiException(HttpStatusCode.BadRequest, "No file selected.");

        const long maxAvatarSize = 1024 * 1024;
        if (file.Length > maxAvatarSize)
            throw new ApiException(HttpStatusCode.BadRequest, "Avatar must be 1 MB max.");

        var extensions = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png",
            ["image/webp"] = ".webp"
        };

        if (!extensions.TryGetValue(file.ContentType, out var extension))
            throw new ApiException(HttpStatusCode.BadRequest, "Avatar must be a JPG, PNG, or WebP image.");

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var relativePath = Path.Combine("avatars", userId.ToString(), fileName);
        var absolutePath = storageService.GetPublicPath(relativePath);
        var storageDir = Path.GetDirectoryName(absolutePath)!;

        Directory.CreateDirectory(storageDir);

        await using var stream = new FileStream(absolutePath, FileMode.CreateNew, FileAccess.Write);
        await file.CopyToAsync(stream);

        var oldStorageKey = user.AvatarKey;
        user.AvatarKey = relativePath.Replace("\\", "/");

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            File.Delete(absolutePath);
            throw new ApiException(HttpStatusCode.BadRequest, "Could not update avatar.");
        }

        if (!string.IsNullOrWhiteSpace(oldStorageKey))
        {
            var oldStoragePath = storageService.GetPublicPath(oldStorageKey);

            if (File.Exists(oldStoragePath))
                File.Delete(oldStoragePath);
        }

        return new Response<string>("Avatar uploaded.", user.AvatarKey.ToPublicUrl());
    }
}