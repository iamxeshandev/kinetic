using Microsoft.AspNetCore.Identity;

namespace kinetic_api.Models;

public class ApplicationUser : IdentityUser<Guid>
{
    public required string FirstName { get; set; }
    public string? LastName { get; set; }

    public string? AvatarKey { get; set; }

    public Guid? ActiveWorkspaceId { get; set; }
}