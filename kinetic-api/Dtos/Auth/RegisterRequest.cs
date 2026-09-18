using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record RegisterRequest(
    [Required(ErrorMessage = "Enter an email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    string Email,
    [Required(ErrorMessage = "Enter a password.")]
    [Length(8, 50, ErrorMessage = "Password must be between 8 to 50 characters.")]
    string Password,
    [Required(ErrorMessage = "Enter your first name.")]
    [MaxLength(50, ErrorMessage = "First name must be 50 characters or fewer.")]
    string FirstName,
    [MaxLength(50, ErrorMessage = "Last name must be 50 characters or fewer.")]
    string? LastName
);