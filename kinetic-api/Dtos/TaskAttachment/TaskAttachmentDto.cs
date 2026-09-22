namespace kinetic_api.Dtos.TaskAttachment;

public record TaskAttachmentDto
{
    public required Guid Id { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required long SizeBytes { get; init; }
    public required string DownloadUrl { get; init; }
}