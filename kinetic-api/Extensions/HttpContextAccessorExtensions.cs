using System.Security.Claims;

namespace kinetic_api.Extensions;

public static class HttpContextAccessorExtensions
{
    public static Guid GetUserId(this IHttpContextAccessor accessor)
    {
        return accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToGuid() ?? Guid.Empty;
    }
}