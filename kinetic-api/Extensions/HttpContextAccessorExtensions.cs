using System.Net;
using System.Security.Claims;
using kinetic_api.Exceptions;

namespace kinetic_api.Extensions;

public static class HttpContextAccessorExtensions
{
    public static Guid GetUserId(this IHttpContextAccessor accessor)
    {
        return accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToGuid() ??
               throw new ApiException(HttpStatusCode.Unauthorized, "You have been logged out.");
    }
}