using System.Text.Json;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskRequest(
    Guid SectionId,
    string Name,
    JsonElement? Description,
    EPriority Priority,
    DateTimeOffset? DueDate,
    Guid? AssigneeId
);