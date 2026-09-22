using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record LoginRequest
{
    [EmailAddress] [MaxLength(254)] public required string Email { get; init; }
    [MaxLength(128)] public required string Password { get; init; }
    public bool RememberMe { get; init; }
}