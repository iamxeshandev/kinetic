using System.Net;
using System.Security.Claims;
using kinetic_api.Data;
using kinetic_api.Enums;
using kinetic_api.Exceptions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Authorization;
using Task = System.Threading.Tasks.Task;

namespace kinetic_api.Authorization;

// Check minimum role requirement. Authorize if role is valid

public sealed class MinimumRoleRequirement(params (string Table, Enum Role)[] minimumRoles) : IAuthorizationRequirement
{
    public (string Table, Enum Role)[] MinimumRoles { get; } = minimumRoles;
}

public sealed class MinimumRoleHandler(AppDbContext db) : AuthorizationHandler<MinimumRoleRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        MinimumRoleRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext ||
            !Guid.TryParse(context.User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            throw new ApiException(HttpStatusCode.Unauthorized, "You have been logged out.");

        Guid? workspaceId = Guid.TryParse(httpContext.GetRouteValue("workspaceId")?.ToString(), out var gWorkspaceId)
            ? gWorkspaceId
            : null;
        Guid? projectId = Guid.TryParse(httpContext.GetRouteValue("projectId")?.ToString(), out var gProjectId)
            ? gProjectId
            : null;

        foreach (var (table, minRole) in requirement.MinimumRoles)
        {
            var ok = table switch
            {
                nameof(WorkspaceMember) when workspaceId.HasValue &&
                                             Enum.TryParse<EWorkspaceRole>(minRole.ToString(), out var w) =>
                    (await db.WorkspaceMembers.FindAsync(workspaceId.Value, userId))?.Role >= w,

                nameof(ProjectMember) when workspaceId.HasValue && projectId.HasValue &&
                                           Enum.TryParse<EProjectRole>(minRole.ToString(), out var p) =>
                    (await db.ProjectMembers.FindAsync(workspaceId.Value, projectId.Value, userId))?.Role >= p,

                _ => false
            };

            if (ok)
            {
                context.Succeed(requirement);
                return;
            }
        }

        throw new ApiException(HttpStatusCode.Forbidden, "You are not authorized to perform this action.");
    }
}