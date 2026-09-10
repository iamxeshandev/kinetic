using kinetic_api.Enums;

namespace kinetic_api.Models;

public class UserFavorite
{
    public required Guid UserId { get; init; }
    public virtual ApplicationUser User { get; set; } = null!;

    public EFavoriteEntityType EntityType { get; init; }
    public Guid EntityId { get; init; }
}