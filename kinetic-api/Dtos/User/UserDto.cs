using kinetic_api.Enums;

namespace kinetic_api.Dtos.User;

public record UserDto
{
    public required Guid Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public string? LastName { get; init; }
    public string FullName => $"{FirstName} {LastName}";
    public string? AvatarUrl { get; init; }
    public required EWorkspaceRole Role { get; init; }
}