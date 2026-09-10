namespace kinetic_api.Dtos.Task;

public record SubtaskDto(Guid? Id, Guid? TaskId, string Name);