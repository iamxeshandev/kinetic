namespace kinetic_api.Dtos.Auth;

public record LoginDto(
    string Email,
    string Password,
    bool RememberMe
);