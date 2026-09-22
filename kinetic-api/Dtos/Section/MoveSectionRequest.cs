namespace kinetic_api.Dtos.Section;

public record MoveSectionRequest
{
    public Guid? PreviousSectionId { get; init; }
    public Guid? NextSectionId { get; init; }
}