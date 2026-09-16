using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectRequest(
    string Name,
    string? Description,
    EProjectStatus Status,
    EPriority Priority,
    bool IsFavorite,
    DateTimeOffset? DueDate,
    List<Guid>? LeadIds,
    List<Guid>? MemberIds
);