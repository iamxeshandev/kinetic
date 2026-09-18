using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.User;

public record UserRequest(
    [Required(ErrorMessage = "Enter an email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    string Email,
    [Required(ErrorMessage = "Select a role.")]
    EWorkspaceRole Role
);