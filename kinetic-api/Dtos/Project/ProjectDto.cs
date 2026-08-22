namespace kinetic_api.Dtos.Project;

public record ProjectDto(
    Guid Id,
    string Name,
    string? Description
);