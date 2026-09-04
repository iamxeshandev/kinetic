using kinetic_api.Enums;

namespace kinetic_api.Models;

public class UserFavorite
{
    public Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = null!;

    public EFavoriteEntityType EntityType { get; init; }
    public Guid EntityId { get; set; }
}