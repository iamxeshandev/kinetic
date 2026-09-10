using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Models;

public class TaskComment
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public required Guid TaskId { get; init; }
    public virtual Task Task { get; set; } = null!;

    public required Guid AuthorId { get; init; }
    public virtual ApplicationUser Author { get; set; } = null!;

    [MaxLength(2000)] public required string Content { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
}