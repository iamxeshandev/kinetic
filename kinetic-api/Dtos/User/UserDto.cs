using kinetic_api.Enums;

namespace kinetic_api.Dtos.User;

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string? LastName,
    string? AvatarUrl,
    EWorkspaceRole Role,
    DateTimeOffset JoinedAt
);