namespace kinetic_api.Dtos.Task;

public record MoveTaskRequest(
    Guid SectionId,
    Guid? PreviousTaskId,
    Guid? NextTaskId
);