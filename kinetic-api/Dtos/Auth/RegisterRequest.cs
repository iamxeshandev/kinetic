using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record RegisterRequest
{
    [EmailAddress] [MaxLength(254)] public required string Email { get; init; }
    [Length(8, 128)] public required string Password { get; init; }
    [MaxLength(100)] public required string FirstName { get; init; }
    [MaxLength(100)] public string? LastName { get; init; }
}