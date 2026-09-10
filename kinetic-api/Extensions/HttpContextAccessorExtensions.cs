using System.Security.Claims;

namespace kinetic_api.Extensions;

public static class HttpContextAccessorExtensions
{
    public static Guid GetUserId(this IHttpContextAccessor accessor)
    {
        return Guid.TryParse(accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier), out var guid)
            ? guid
            : throw new UnauthorizedAccessException();
    }
}