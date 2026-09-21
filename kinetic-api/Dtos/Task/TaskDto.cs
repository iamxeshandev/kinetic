using System.Text.Json;
using kinetic_api.Dtos.Project;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskDto(
    Guid Id,
    int RefId,
    Guid SectionId,
    string Name,
    JsonElement? Description,
    long Position,
    EPriority Priority,
    DateTimeOffset? DueDate,
    DateTimeOffset? CompletedAt,
    DateTimeOffset? AssignedAt,
    ProjectMemberDto? Assignee,
    List<SubtaskDto>? Subtasks,
    List<TaskAttachmentDto>? Attachments
);