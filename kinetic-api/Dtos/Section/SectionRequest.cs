using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Section;

public record SectionRequest(
    [Required(ErrorMessage = "Enter a section name.")]
    [MaxLength(50, ErrorMessage = "Section name must be 50 characters or fewer.")]
    string Name
);