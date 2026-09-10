using kinetic_api.Enums;

namespace kinetic_api.Dtos.User;

public record UserDto(
    Guid? Id,
    string? FirstName,
    string? LastName,
    string Email,
    string? AvatarUrl,
    EWorkspaceRole Role,
    DateTimeOffset? JoinedAt
);