using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Dtos.Auth;

public record MeRequest
{
    [MaxLength(50)] public required string FirstName { get; init; }
    [MaxLength(50)] public string? LastName { get; init; }
}