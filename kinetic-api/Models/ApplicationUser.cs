using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace kinetic_api.Models;

public class ApplicationUser : IdentityUser<Guid>
{
    [MaxLength(50)] public required string FirstName { get; set; }
    [MaxLength(50)] public string? LastName { get; set; }

    [NotMapped] public string FullName => $"{FirstName} {LastName}";

    public Guid? CurrentWorkspaceId { get; set; }
    public Workspace? CurrentWorkspace { get; set; }
}