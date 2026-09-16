namespace kinetic_api.Dtos.Auth;

public record LoginRequest(
    string Email,
    string Password,
    bool RememberMe
);