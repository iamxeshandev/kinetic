using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class FavoriteService(AppDbContext db, IHttpContextAccessor accessor)
{
    public async Task<Response> AddFavorite(EFavoriteEntityType entityType, Guid entityId)
    {
        var userId = accessor.GetUserId();

        var exists = await db.UserFavorites.AnyAsync(o =>
            o.UserId == userId && o.EntityType == entityType && o.EntityId == entityId);

        if (!exists)
        {
            db.UserFavorites.Add(new UserFavorite
            {
                UserId = userId,
                EntityType = entityType,
                EntityId = entityId
            });
            await db.SaveChangesAsync();
        }

        return new Response("Added to favorites.");
    }

    public async Task<Response> RemoveFavorite(EFavoriteEntityType entityType, Guid entityId)
    {
        var userId = accessor.GetUserId();

        await db.UserFavorites
            .Where(o => o.UserId == userId && o.EntityType == entityType && o.EntityId == entityId)
            .ExecuteDeleteAsync();

        return new Response("Removed from favorites.");
    }
}