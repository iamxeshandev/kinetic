using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Project : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid WorkspaceId { get; set; }
    public virtual Workspace Workspace { get; set; } = null!;

    [MaxLength(100)] public required string Name { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    public required EProjectStatus Status { get; set; }
    public required EPriority Priority { get; set; }
    public DateTimeOffset? DueDate { get; set; }

    public required Guid CreatedBy { get; init; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}