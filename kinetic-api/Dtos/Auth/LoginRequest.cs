using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record LoginRequest(
    [property: Required(ErrorMessage = "Enter your email address")]
    [property: EmailAddress(ErrorMessage = "Enter a valid email address.")]
    string Email,
    [property: Required(ErrorMessage = "Enter your password.")]
    string Password,
    bool RememberMe
);