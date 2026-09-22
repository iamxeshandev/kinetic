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
    public async Task<Response> RegisterAsync(RegisterRequest request)
    {
        var existedUser = await userManager.FindByEmailAsync(request.Email);
        if (existedUser is not null)
            throw new ApiException(HttpStatusCode.BadRequest, "Email already exists.");

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email.ToLower(),
            Email = request.Email.ToLower(),
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var workspace = new Workspace
        {
            Name = "Personal Workspace",
            IsPersonalWorkspace = true,
            CreatedBy = user.Id
        };
        db.Workspaces.Add(workspace);

        var member = new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = user.Id,
            Role = EWorkspaceRole.Owner
        };
        db.WorkspaceMembers.Add(member);

        user.ActiveWorkspaceId = workspace.Id;

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.BadRequest, "User creation failed.");

        await db.SaveChangesAsync();
        return new Response("Registered successfully.");
    }

    public async Task<Response<MeDto>> LoginAsync(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid credentials.");

        var result = await signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            request.RememberMe,
            false
        );
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.Unauthorized, "Invalid credentials.");

        var responseDto = await GetMeAsync().GetDataAsync();

        return new Response<MeDto>(responseDto!);
    }

    public async Task<Response> LogoutAsync()
    {
        await signInManager.SignOutAsync();
        return new Response("Logged out successfully.");
    }


    public async Task<Response<MeDto>> SwitchAsync(Guid workspaceId)
    {
        var userId = accessor.GetUserId();

        var user = await userManager.FindByIdAsync(userId.ToString()) ??
                   throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        var isWorkspaceMember =
            await db.WorkspaceMembers.AnyAsync(o => o.WorkspaceId == workspaceId && o.UserId == userId);
        if (!isWorkspaceMember)
            throw new ApiException(HttpStatusCode.NotFound, "Workspace not found.");

        user.ActiveWorkspaceId = workspaceId;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.InternalServerError, "Something went wrong. Try again later.");

        var responseDto = await GetMeAsync().GetDataAsync();

        return new Response<MeDto>(responseDto!);
    }


    public async Task<Response<MeDto?>> GetMeAsync()
    {
        if (accessor.HttpContext?.User.Identity is null ||
            !accessor.HttpContext.User.Identity.IsAuthenticated ||
            accessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) is not { } userId ||
            await userManager.FindByIdAsync(userId) is not { } user)
            return new Response<MeDto?>(null);

        var responseDto = new MeDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarUrl = user.AvatarKey,
            ActiveWorkspace = user.ActiveWorkspaceId is null
                ? null
                : await db.WorkspaceMembers
                    .Where(o => o.WorkspaceId == user.ActiveWorkspaceId && o.UserId == user.Id)
                    .Select(o => new WorkspaceDto
                    {
                        Id = o.Workspace.Id,
                        Name = o.Workspace.Name,
                        IsPersonalWorkspace = o.Workspace.IsPersonalWorkspace,
                        Role = o.Role,
                        MemberCount = db.WorkspaceMembers.Count(wm => wm.WorkspaceId == o.WorkspaceId)
                    })
                    .SingleOrDefaultAsync()
        };

        return new Response<MeDto?>(responseDto);
    }

    public async Task<Response<MeDto>> UpdateMeAsync(MeRequest request)
    {
        var userId = accessor.GetUserId();

        var user = await userManager.FindByIdAsync(userId.ToString()) ??
                   throw new ApiException(HttpStatusCode.NotFound, "User  not found.");
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new ApiException(HttpStatusCode.BadRequest, "Could not update user.");

        var responseDto = await GetMeAsync().GetDataAsync();

        return new Response<MeDto>("User updated.", responseDto!);
    }

    public async Task<Response<MeDto>> UploadAvatarAsync(IFormFile file, ClaimsPrincipal currentUser)
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

        var responseDto = await GetMeAsync().GetDataAsync();

        return new Response<MeDto>("Avatar uploaded.", responseDto!);
    }
}