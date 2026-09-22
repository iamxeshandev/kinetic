using System.Text.Json;
using kinetic_api.Dtos.Project;
using kinetic_api.Dtos.Subtask;
using kinetic_api.Dtos.TaskAttachment;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Task;

public record TaskDto
{
    public required Guid Id { get; init; }
    public required int RefId { get; init; }
    public required string Name { get; init; }
    public JsonElement? Description { get; init; }
    public required Guid SectionId { get; init; }
    public required long Position { get; init; }
    public required EPriority Priority { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public DateTimeOffset? CompletedAt { get; init; }
    public ProjectMemberDto? Assignee { get; init; }
    public DateTimeOffset? AssignedAt { get; init; }
    public required List<TaskAttachmentDto> Attachments { get; init; }
    public required List<SubtaskDto> Subtasks { get; init; }
}