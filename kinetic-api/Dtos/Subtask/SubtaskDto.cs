namespace kinetic_api.Dtos.Subtask;

public record SubtaskDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required long Position { get; init; }
    public DateTimeOffset? CompletedAt { get; init; }
}