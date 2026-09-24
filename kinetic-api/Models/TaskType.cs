using System.ComponentModel.DataAnnotations;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class TaskType : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid ProjectId { get; init; }
    public virtual Project Project { get; init; } = null!;

    [MaxLength(100)] public required string Name { get; set; }
    [MaxLength(100)] public required string Code { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public Guid CreatedBy { get; init; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}