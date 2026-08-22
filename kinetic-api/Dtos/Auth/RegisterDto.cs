using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record RegisterDto(
    [Required]
    [EmailAddress]
    [Length(8, 100)]
    string Email,
    [Required] [Length(8, 100)] string Password,
    [Required]
    [MaxLength(50)]
    [RegularExpression(@"\S.*")]
    string FirstName,
    [MaxLength(50)]
    [RegularExpression(@"\S.*")]
    string? LastName
);