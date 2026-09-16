namespace kinetic_api.Dtos.Section;

public record MoveSectionRequest(
    Guid? PreviousSectionId,
    Guid? NextSectionId
);