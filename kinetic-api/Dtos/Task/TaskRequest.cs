using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskRequest
{
    public required Guid SectionId { get; init; }
    [MaxLength(100)] public required string Name { get; init; }
    public JsonElement? Description { get; init; }
    public required EPriority Priority { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public Guid? TaskTypeId { get; init; }
    public Guid[] TaskLabelIds { get; init; } = [];
    public Guid? AssigneeId { get; init; }
    public Guid? PreviousTaskId { get; init; }
    public Guid? NextTaskId { get; init; }
}