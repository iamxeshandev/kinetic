using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectDto(
    Guid? Id,
    string Name,
    string? Description,
    EProjectStatus Status = EProjectStatus.Active,
    EPriority Priority = EPriority.None,
    DateTimeOffset? DueDate = null,
    bool IsFavorite = false,
    List<ProjectMemberDto>? Team = null
);