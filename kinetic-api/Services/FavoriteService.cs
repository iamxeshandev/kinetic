using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class FavoriteService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response> AddFavorite(Guid workspaceId, Guid entityId, EFavoriteEntityType entityType)
    {
        var userId = accessor.GetUserId();

        var exists = await db.UserFavorites
            .AnyAsync(o =>
                o.WorkspaceId == workspaceId &&
                o.UserId == userId && o.EntityType == entityType &&
                o.EntityId == entityId
            );

        if (!exists)
        {
            db.UserFavorites.Add(new UserFavorite
            {
                WorkspaceId = workspaceId,
                UserId = userId,
                EntityType = entityType,
                EntityId = entityId
            });
            await db.SaveChangesAsync();
        }

        return new Response("Added to favorites.");
    }

    public async Task<Response> RemoveFavorite(Guid workspaceId, Guid entityId)
    {
        var userId = accessor.GetUserId();

        await db.UserFavorites
            .Where(o => o.WorkspaceId == workspaceId && o.UserId == userId && o.EntityId == entityId)
            .ExecuteDeleteAsync();

        return new Response("Removed from favorites.");
    }
}