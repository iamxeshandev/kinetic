namespace kinetic_api.Dtos.Task;

public record TaskAttachmentDto(
    Guid Id,
    string FileName,
    string ContentType,
    long Size,
    string DownloadUrl
);