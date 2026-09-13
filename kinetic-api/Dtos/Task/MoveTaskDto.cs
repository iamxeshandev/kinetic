namespace kinetic_api.Dtos.Task;

public record MoveTaskDto(Guid SectionId, Guid? PreviousTaskId, Guid? NextTaskId);