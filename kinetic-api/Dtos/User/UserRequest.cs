using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.User;

public class UserRequest
{
    [EmailAddress] [MaxLength(254)] public required string Email { get; init; }
    public required EWorkspaceRole Role { get; init; }
}