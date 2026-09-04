namespace kinetic_api.Interfaces;

public interface IAuditable
{
    DateTimeOffset CreatedAt { get; init; }
    Guid CreatedBy { get; init; }
    DateTimeOffset? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
}