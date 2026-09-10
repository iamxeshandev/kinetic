using kinetic_api.Enums;

namespace kinetic_api.Dtos.Workspace;

public record WorkspaceDto(Guid? Id, string Name, EWorkspaceRole? Role, bool IsPersonal, int Members);