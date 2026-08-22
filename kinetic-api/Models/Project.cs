using System.ComponentModel.DataAnnotations;
using kinetic_api.Interfaces;

namespace kinetic_api.Models;

public class Project : ISoftDeletable
{
    public Guid Id { get; init; } = Guid.NewGuid();
    [MaxLength(100)] public required string Name { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}