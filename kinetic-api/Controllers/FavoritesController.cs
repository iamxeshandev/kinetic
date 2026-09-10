using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]/{entityType}/{entityId:guid}")]
public class FavoritesController(FavoriteService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Response>> AddFavorite(EFavoriteEntityType entityType, Guid entityId)
    {
        return await service.AddFavorite(entityType, entityId);
    }

    [HttpDelete]
    public async Task<ActionResult<Response>> RemoveFavorite(EFavoriteEntityType entityType, Guid entityId)
    {
        return await service.RemoveFavorite(entityType, entityId);
    }
}