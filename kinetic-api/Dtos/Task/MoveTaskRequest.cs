namespace kinetic_api.Dtos.Task;

public record MoveTaskRequest
{
    public required Guid SectionId { get; init; }
    public Guid? PreviousTaskId { get; init; }
    public Guid? NextTaskId { get; init; }
}