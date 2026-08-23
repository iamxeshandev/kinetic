namespace kinetic_api.Interfaces;

public interface IAuditableEntity
{
    DateTime CreatedAt { get; init; }
    Guid CreatedBy { get; init; }
    DateTime? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
    DateTime? DeletedAt { get; set; }
    Guid? DeletedBy { get; set; }
}