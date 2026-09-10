using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Task : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid SectionId { get; set; }
    public virtual Section Section { get; set; } = null!;

    [Required] [MaxLength(100)] public required string Name { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    public EPriority Priority { get; set; }
    public required long Position { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }

    public Guid? AssigneeId { get; set; }
    public virtual ApplicationUser? Assignee { get; set; }
    public DateTimeOffset? AssignedAt { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public required Guid CreatedBy { get; init; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}