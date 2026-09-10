namespace kinetic_api.Extensions;

public static class StringExtensions
{
    public static string ToPublicUrl(this string? value)
    {
        return string.IsNullOrEmpty(value) ? string.Empty : $"storage/public/{value}";
    }
}