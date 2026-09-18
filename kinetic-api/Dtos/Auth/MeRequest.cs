using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record MeRequest(
    [Required(ErrorMessage = "Enter your first name.")]
    [MaxLength(50, ErrorMessage = "First name must be 50 characters or fewer.")]
    string FirstName,
    [MaxLength(50, ErrorMessage = "Last name must be 50 characters or fewer.")]
    string? LastName
);