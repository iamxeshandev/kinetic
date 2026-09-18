using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectRequest(
    [Required(ErrorMessage = "Enter a project name.")]
    [MaxLength(100, ErrorMessage = "Project name must be 100 characters or fewer.")]
    string Name,
    [MaxLength(1000, ErrorMessage = "Project description must be 1,000 characters or fewer.")]
    string? Description,
    [Required(ErrorMessage = "Select a project status.")]
    EProjectStatus Status,
    [Required(ErrorMessage = "Select a project priority.")]
    EPriority Priority,
    DateTimeOffset? DueDate,
    [MaxLength(5, ErrorMessage = "You can select up to 5 leads.")]
    List<Guid>? LeadIds,
    [MaxLength(20, ErrorMessage = "You can select up to 20 members.")]
    List<Guid>? MemberIds
);