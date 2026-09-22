using kinetic_api.Enums;

namespace kinetic_api.Dtos.Workspace;

public record WorkspaceDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required EWorkspaceRole Role { get; init; }
    public bool IsPersonalWorkspace { get; init; }
    public required int MemberCount { get; init; }
}