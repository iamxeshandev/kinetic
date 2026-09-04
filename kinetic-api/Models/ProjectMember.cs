using kinetic_api.Enums;

namespace kinetic_api.Models;

public class ProjectMember
{
    public Guid WorkspaceId { get; set; }
    public virtual Workspace Workspace { get; set; } = null!;
    public Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = null!;
    public Guid ProjectId { get; set; }
    public virtual Project Project { get; set; } = null!;
    public EProjectRole Role { get; set; }
}