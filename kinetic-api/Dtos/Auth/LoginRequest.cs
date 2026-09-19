using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record LoginRequest(
    [Required(ErrorMessage = "Enter your email address")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    string Email,
    [Required(ErrorMessage = "Enter your password.")]
    string Password,
    bool RememberMe
);