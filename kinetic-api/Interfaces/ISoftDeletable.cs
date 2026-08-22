namespace kinetic_api.Interfaces;

public interface ISoftDeletable
{
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}