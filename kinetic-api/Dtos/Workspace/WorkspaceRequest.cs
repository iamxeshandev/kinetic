using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Workspace;

public record WorkspaceRequest
{
    [MaxLength(100)] public required string Name { get; init; }
}