using kinetic_api.Enums;

namespace kinetic_api.Models;

public class UserFavorite
{
    public required Guid WorkspaceId { get; init; }
    public virtual Workspace Workspace { get; set; } = null!;

    public required Guid UserId { get; init; }
    public virtual ApplicationUser User { get; set; } = null!;

    public required Guid EntityId { get; init; }
    public required EFavoriteEntityType EntityType { get; init; }
}