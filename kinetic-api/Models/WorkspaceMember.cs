using kinetic_api.Enums;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class WorkspaceMember : IAuditable
{
    public required Guid WorkspaceId { get; set; }
    public virtual Workspace Workspace { get; set; } = null!;
    public required Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = null!;
    public required EWorkspaceRole Role { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public required Guid CreatedBy { get; init; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}