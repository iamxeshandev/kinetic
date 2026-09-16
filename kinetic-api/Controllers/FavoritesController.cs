using System.ComponentModel.DataAnnotations;
using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/[controller]")]
public class FavoritesController(FavoriteService service) : ControllerBase
{
    [HttpPost("{entityId:guid}")]
    public async Task<ActionResult<Response>> AddFavorite(Guid workspaceId, Guid entityId,
        [Required] EFavoriteEntityType? entityType)
    {
        return await service.AddFavorite(workspaceId, entityId, entityType!.Value);
    }

    [HttpDelete]
    public async Task<ActionResult<Response>> RemoveFavorite(Guid workspaceId, Guid entityId)
    {
        return await service.RemoveFavorite(workspaceId, entityId);
    }
}