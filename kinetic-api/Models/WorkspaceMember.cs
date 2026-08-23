using kinetic_api.Enums;

namespace kinetic_api.Models;

public class WorkspaceMember
{
    public required Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;

    public required Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public required EWorkspaceRole Role { get; set; }
}