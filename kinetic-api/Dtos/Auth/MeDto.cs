using kinetic_api.Dtos.Workspace;

namespace kinetic_api.Dtos.Auth;

public record MeDto(
    Guid? Id,
    string? Email,
    string FirstName,
    string? LastName,
    string? AvatarUrl,
    WorkspaceDto? CurrentWorkspace
);