namespace kinetic_api.Dtos.Subtask;

public record MoveSubtaskRequest
{
    public Guid? PreviousSubtaskId { get; init; }
    public Guid? NextSubtaskId { get; init; }
}