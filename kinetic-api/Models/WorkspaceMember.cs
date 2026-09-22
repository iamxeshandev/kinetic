using kinetic_api.Enums;

namespace kinetic_api.Models;

public class WorkspaceMember
{
    public required Guid WorkspaceId { get; init; }
    public virtual Workspace Workspace { get; set; } = null!;

    public required Guid UserId { get; init; }
    public virtual ApplicationUser User { get; set; } = null!;

    public required EWorkspaceRole Role { get; set; }
}