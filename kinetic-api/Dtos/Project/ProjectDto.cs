using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required EPriority Priority { get; init; }
    public required EProjectStatus Status { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public EProjectRole? Role { get; init; }
    public required List<ProjectMemberDto> Team { get; init; }
}