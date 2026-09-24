using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.TaskLabel;

public record TaskLabelRequest
{
    [Required] [MaxLength(50)] public required string Name { get; init; }
}