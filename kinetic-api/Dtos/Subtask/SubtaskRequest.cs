using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Subtask;

public record SubtaskRequest(
    [Required(ErrorMessage = "Enter a subtask name.")]
    [MaxLength(200, ErrorMessage = "Section name must be 200 characters or fewer.")]
    string Name,
    bool IsCompleted
);