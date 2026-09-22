using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Section;

public record SectionRequest
{
    [MaxLength(100)] public required string Name { get; init; }
}