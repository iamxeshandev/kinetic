using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectDto(
    Guid Id,
    string Name,
    string? Description,
    EProjectStatus Status,
    EPriority Priority,
    EProjectRole? Role,
    bool IsFavorite,
    DateTimeOffset? DueDate,
    List<ProjectMemberDto>? Team
);