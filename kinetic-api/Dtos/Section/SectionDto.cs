namespace kinetic_api.Dtos.Section;

public record SectionDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
}