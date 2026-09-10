using System.ComponentModel.DataAnnotations;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Section : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid ProjectId { get; init; }
    public virtual Project Project { get; set; } = null!;

    [Required] [MaxLength(100)] public required string Name { get; set; }
    public required long Position { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public required Guid CreatedBy { get; init; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}