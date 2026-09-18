using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Workspace;

public record WorkspaceRequest(
    [Required(ErrorMessage = "Enter a workspace name.")]
    [MaxLength(100, ErrorMessage = "Workspace name must be 100 characters or fewer.")]
    string Name
);