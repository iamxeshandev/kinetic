using System.ComponentModel.DataAnnotations;
using kinetic_api.Dtos.Common;
using kinetic_api.Enums;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kinetic_api.Controllers;

[ApiController]
[Authorize]
[Route("api/workspaces/{workspaceId:guid}/favorites")]
public class FavoritesController(FavoriteService service) : ControllerBase
{
    [HttpPost("{entityId:guid}")]
    [EndpointName("CreateFavorite")]
    public async Task<ActionResult<Response>> CreateFavoriteAsync(Guid workspaceId, Guid entityId,
        [Required] EFavoriteEntityType? entityType)
    {
        return await service.CreateFavoriteAsync(workspaceId, entityId, entityType!.Value);
    }

    [HttpDelete("{entityId:guid}")]
    [EndpointName("DeleteFavorite")]
    public async Task<ActionResult<Response>> DeleteFavoriteAsync(Guid workspaceId, Guid entityId)
    {
        return await service.DeleteFavoriteAsync(workspaceId, entityId);
    }
}