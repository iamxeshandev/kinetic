using kinetic_api.Dtos.Project;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskDto(
    Guid? Id,
    Guid SectionId,
    string Name,
    string? Description,
    EPriority Priority,
    DateTimeOffset? DueDate,
    DateTimeOffset? CompletedAt,
    DateTimeOffset? AssignedAt,
    ProjectMemberDto? Assignee,
    List<SubtaskDto>? Subtasks,
    List<TaskAttachmentDto>? Attachments
);