namespace kinetic_api.Dtos.TaskLabel;

public record TaskLabelDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
}