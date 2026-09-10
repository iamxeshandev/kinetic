using kinetic_api.Enums;

namespace kinetic_api.Models;

public class ProjectMember
{
    public required Guid ProjectId { get; init; }
    public virtual Project Project { get; set; } = null!;
    public required Guid UserId { get; init; }
    public virtual ApplicationUser User { get; set; } = null!;
    public EProjectRole Role { get; set; }
}