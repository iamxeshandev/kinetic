using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Subtask;

public record SubtaskRequest
{
    [MaxLength(1000)] public required string Name { get; init; }
    public Guid? PreviousSubtaskId { get; init; }
    public Guid? NextSubtaskId { get; init; }
}