using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using kinetic_api.Enums;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Task : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid ProjectId { get; init; }
    public virtual Project Project { get; set; } = null!;

    public required Guid SectionId { get; set; }
    public required int RefId { get; init; }
    [MaxLength(1000)] public required string Name { get; set; }
    public JsonElement? Description { get; set; }
    public required long Position { get; set; }
    public EPriority Priority { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public Guid? TaskTypeId { get; set; }
    public virtual TaskType? TaskType { get; set; }
    public ICollection<TaskLabel> TaskLabels { get; set; } = [];

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