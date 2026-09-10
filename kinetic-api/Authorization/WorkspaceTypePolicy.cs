using System.Net;
using kinetic_api.Data;
using kinetic_api.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Authorization;

// Check if a workspace is personal. Authorize for non-personal workspaces.

// 1. Requirement accepts expected 'IsPersonal' state
public sealed class WorkspaceTypeRequirement(bool isPersonal) : IAuthorizationRequirement
{
    public bool IsPersonal { get; } = isPersonal;
}

public sealed class WorkspaceTypeHandler(AppDbContext db) : AuthorizationHandler<WorkspaceTypeRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        WorkspaceTypeRequirement requirement)
    {
        // Extract HttpContext and Workspace ID from route
        if (context.Resource is HttpContext httpContext &&
            Guid.TryParse(httpContext.Request.RouteValues["workspaceId"]?.ToString(), out var workspaceId))
        {
            // Query expected workspace type from DB
            var isPersonal = await db.Workspaces
                .Where(w => w.Id == workspaceId)
                .Select(w => (bool?)w.IsPersonal)
                .SingleOrDefaultAsync();

            // Validate against the required boolean value
            if (isPersonal.HasValue && isPersonal.Value == requirement.IsPersonal)
            {
                context.Succeed(requirement);
                return;
            }
        }

        throw new ApiException(HttpStatusCode.Forbidden, "You are not authorized to perform this action.");
    }
}