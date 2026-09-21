namespace kinetic_api.Dtos.Subtask;

public record SubtaskDto(
    Guid Id,
    Guid TaskId,
    string Name,
    bool IsCompleted
);