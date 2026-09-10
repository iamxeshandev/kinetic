using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectMemberDto(
    Guid Id,
    string? FirstName,
    string? LastName,
    string? Email,
    string? AvatarUrl,
    EProjectRole Role = EProjectRole.Member
);