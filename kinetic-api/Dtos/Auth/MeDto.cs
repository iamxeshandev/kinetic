using kinetic_api.Dtos.Workspace;

namespace kinetic_api.Dtos.Auth;

public record MeDto
{
    public required Guid Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public string? LastName { get; init; }
    public string FullName => $"{FirstName} {LastName}";
    public string? AvatarUrl { get; init; }
    public WorkspaceDto? ActiveWorkspace { get; init; }
}