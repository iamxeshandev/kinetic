using System.ComponentModel.DataAnnotations;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class TaskAttachment : ITrackable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required Guid TaskId { get; init; }
    public virtual Task Task { get; set; } = null!;

    [Required] [MaxLength(100)] public required string FileName { get; init; }
    [Required] [MaxLength(1000)] public required string StorageKey { get; init; }
    [Required] [MaxLength(100)] public required string ContentType { get; init; }
    public required long SizeBytes { get; init; }

    public required Guid CreatedBy { get; init; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
}