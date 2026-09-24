using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.TaskType;

public record TaskTypeRequest
{
    [Required] [MaxLength(50)] public required string Name { get; init; }
    [Required] [Length(2, 5)] public required string Code { get; init; }
}