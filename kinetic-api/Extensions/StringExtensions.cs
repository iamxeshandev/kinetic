namespace kinetic_api.Extensions;

public static class StringExtensions
{
    public static Guid? ToGuid(this string value)
    {
        return Guid.TryParse(value, out var result) ? result : null;
    }
}