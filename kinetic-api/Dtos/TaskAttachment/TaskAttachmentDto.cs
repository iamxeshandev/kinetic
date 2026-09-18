namespace kinetic_api.Dtos.TaskAttachment;

public record TaskAttachmentDto(
    Guid Id,
    string FileName,
    string ContentType,
    long Size,
    string DownloadUrl
);