using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Subtask : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid TaskId { get; init; }
    public virtual Task Task { get; set; } = null!;

    public required string Name { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public required long Position { get; set; }

    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public required Guid CreatedBy { get; init; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}