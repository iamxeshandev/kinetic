namespace kinetic_api.dtos;

public record ProjectDto(
    Guid Id,
    string Name,
    string? Description
);