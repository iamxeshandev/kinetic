namespace kinetic_api.Dtos.Auth;

public record MeRequest(
    string FirstName,
    string? LastName
);