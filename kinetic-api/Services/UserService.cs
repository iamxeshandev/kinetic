using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.User;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class UserService(AppDbContext db, IHttpContextAccessor accessor, UserManager<ApplicationUser> userManager)
{
    public async Task<Response<List<UserDto>>> GetAllUsersAsync(Guid workspaceId)
    {
        var records = await db.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId)
            .OrderByDescending(o =>
                o.Role == EWorkspaceRole.Owner ? (int)EWorkspaceRole.Owner :
                o.Role == EWorkspaceRole.Admin ? (int)EWorkspaceRole.Admin :
                o.Role == EWorkspaceRole.Manager ? (int)EWorkspaceRole.Manager :
                (int)EWorkspaceRole.Member)
            .ThenBy(o => o.User.FirstName)
            .ThenBy(o => o.User.LastName)
            .Select(o => new UserDto
            {
                Id = o.UserId,
                Email = o.User.Email!,
                FirstName = o.User.FirstName,
                LastName = o.User.LastName,
                AvatarUrl = o.User.AvatarKey.ToPublicUrl(),
                Role = o.Role
            })
            .ToListAsync();

        return new Response<List<UserDto>>(records);
    }

    public async Task<Response<UserDto>> GetUserByIdAsync(Guid workspaceId, Guid userId)
    {
        var record = await db.WorkspaceMembers
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == userId)
            .Select(o => new UserDto
            {
                Id = o.UserId,
                Email = o.User.Email!,
                FirstName = o.User.FirstName,
                LastName = o.User.LastName,
                AvatarUrl = o.User.AvatarKey.ToPublicUrl(),
                Role = o.Role
            })
            .SingleOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        return new Response<UserDto>(record);
    }

    public async Task<Response<UserDto>> CreateUserAsync(Guid workspaceId, UserRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email) ??
                   throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        var alreadyJoined = await db.WorkspaceMembers
            .AnyAsync(o => o.WorkspaceId == workspaceId && o.UserId == user.Id);
        if (alreadyJoined)
            throw new ApiException(HttpStatusCode.Conflict, "User already exists.");

        if (request.Role == EWorkspaceRole.Owner)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot create an owner.");

        var currentUserRole = (await db.WorkspaceMembers.FindAsync(workspaceId, accessor.GetUserId()))!.Role;
        var targetRole = request.Role;
        if (currentUserRole <= targetRole)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot create a user with equal or higher role.");

        var member = new WorkspaceMember
        {
            WorkspaceId = workspaceId,
            UserId = user.Id,
            Role = targetRole
        };
        db.Add(member);

        await db.SaveChangesAsync();
        return new Response<UserDto>("User created.",
            await GetUserByIdAsync(member.WorkspaceId, member.UserId).GetDataAsync());
    }

    public async Task<Response<UserDto>> UpdateUserAsync(Guid workspaceId, Guid userId, UserRequest request)
    {
        var member = await db.WorkspaceMembers.FindAsync(workspaceId, userId) ??
                     throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        var currentUserRole = (await db.WorkspaceMembers.FindAsync(workspaceId, accessor.GetUserId()))!.Role;
        var existingRole = member.Role;
        var targetRole = request.Role;
        if (currentUserRole <= existingRole)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot modify a user with equal or higher role.");
        if (currentUserRole <= targetRole)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot assign equal or higher role to a user.");

        member.Role = targetRole;

        await db.SaveChangesAsync();
        return new Response<UserDto>("User updated.",
            await GetUserByIdAsync(member.WorkspaceId, member.UserId).GetDataAsync());
    }

    public async Task<Response> DeleteUserAsync(Guid workspaceId, Guid userId)
    {
        var member = await db.FindAsync<WorkspaceMember>(workspaceId, userId) ??
                     throw new ApiException(HttpStatusCode.NotFound, "User not found.");

        if (member.Role == EWorkspaceRole.Owner)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot remove the owner.");

        var currentUserRole = (await db.WorkspaceMembers.FindAsync(workspaceId, accessor.GetUserId()))!.Role;
        var targetRole = member.Role;
        if (currentUserRole <= targetRole)
            throw new ApiException(HttpStatusCode.Forbidden, "Cannot remove a user with equal or higher role.");

        db.Remove(member);

        await db.SaveChangesAsync();
        return new Response("User removed.");
    }
}