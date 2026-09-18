using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskRequest(
    [Required(ErrorMessage = "Select a section.")]
    Guid SectionId,
    [Required(ErrorMessage = "Enter a task name.")]
    [MaxLength(200, ErrorMessage = "Task name must be 200 characters or fewer.")]
    string Name,
    JsonElement? Description,
    [Required(ErrorMessage = "Select a priority.")]
    EPriority Priority,
    DateTimeOffset? DueDate,
    Guid? AssigneeId
);