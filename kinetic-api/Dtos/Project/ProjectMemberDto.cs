using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectMemberDto
{
    public required Guid Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public string? LastName { get; init; }
    public string FullName => $"{FirstName} {LastName}";
    public string? AvatarUrl { get; init; }
    public required EProjectRole Role { get; init; }
}