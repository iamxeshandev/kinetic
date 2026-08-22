namespace kinetic_api.Dtos.Auth;

public record AuthResponseDto(Guid Id, string Email, string FirstName, string? LastName);