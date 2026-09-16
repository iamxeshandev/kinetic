namespace kinetic_api.Dtos.Auth;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string? LastName
);