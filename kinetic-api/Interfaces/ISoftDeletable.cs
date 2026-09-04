namespace kinetic_api.Interfaces;

public interface ISoftDeletable
{
    DateTimeOffset? DeletedAt { get; set; }
    Guid? DeletedBy { get; set; }
}