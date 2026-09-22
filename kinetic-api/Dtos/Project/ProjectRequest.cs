using System.ComponentModel.DataAnnotations;
using kinetic_api.Enums;

namespace kinetic_api.Dtos.Project;

public record ProjectRequest
{
    [MaxLength(100)] public required string Name { get; init; }
    [MaxLength(1000)] public string? Description { get; init; }
    public required EPriority Priority { get; init; }
    public required EProjectStatus Status { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    [MaxLength(50)] public Guid[]? LeadIds { get; init; }
    [MaxLength(50)] public Guid[]? MemberIds { get; init; }
}