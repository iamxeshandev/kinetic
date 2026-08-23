using System.ComponentModel.DataAnnotations;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Workspace : IAuditableEntity
{
    public Guid Id { get; set; }
    [Required] [MaxLength(100)] public required string Name { get; set; }

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public required Guid CreatedBy { get; init; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}