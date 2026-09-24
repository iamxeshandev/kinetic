namespace kinetic_api.Dtos.TaskType;

public record TaskTypeDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Code { get; init; }
}