using kinetic_api.Configuration;
using Microsoft.Extensions.Options;

namespace kinetic_api.Services;

public class StorageService(IOptions<StorageOptions> options, IWebHostEnvironment environment)
{
    private readonly StorageOptions _storage = options.Value;

    private string GetStorageRootPath()
    {
        var root = environment.IsDevelopment()
            ? Path.Combine(environment.ContentRootPath, "..", _storage.Root)
            : Path.Combine(
                Environment.GetEnvironmentVariable("HOME")!,
                _storage.Root);

        return Path.GetFullPath(root);
    }

    public string GetPublicPath(string storageKey = "")
    {
        return Path.Combine(GetStorageRootPath(), _storage.Public, storageKey);
    }

    public string GetPrivatePath(string storageKey = "")
    {
        return Path.Combine(GetStorageRootPath(), _storage.Private, storageKey);
    }
}