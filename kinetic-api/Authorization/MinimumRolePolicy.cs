using System.Security.Claims;
using kinetic_api.Database;
using kinetic_api.Enums;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.AspNetCore.Authorization;
using Task = System.Threading.Tasks.Task;

namespace kinetic_api.Authorization;

public class MinimumRoleRequirement(params (string Table, Enum Role)[] minimumRoles) : IAuthorizationRequirement
{
    public (string Table, Enum Role)[] MinimumRoles { get; } = minimumRoles;
}

public class MinimumRoleHandler(AppDbContext db) : AuthorizationHandler<MinimumRoleRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        MinimumRoleRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext ||
            !Guid.TryParse(context.User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return;

        var workspaceId = httpContext.GetRouteValue("workspaceId")?.ToString()?.ToGuid();
        var projectId = httpContext.GetRouteValue("projectId")?.ToString()?.ToGuid();

        foreach (var (table, minRole) in requirement.MinimumRoles)
        {
            var success = table switch
            {
                nameof(WorkspaceMember) when workspaceId.HasValue &&
                                             Enum.TryParse<EWorkspaceRole>(minRole.ToString(), out var minW) &&
                                             (await db.WorkspaceMembers.FindAsync(workspaceId.Value, userId))?.Role >=
                                             minW => true,

                nameof(ProjectMember) when workspaceId.HasValue && projectId.HasValue &&
                                           Enum.TryParse<EProjectRole>(minRole.ToString(), out var minP) &&
                                           (await db.ProjectMembers.FindAsync(workspaceId.Value, projectId.Value,
                                               userId))?.Role >=
                                           minP => true,

                _ => false
            };

            if (!success)
                return;

            context.Succeed(requirement);
        }
    }
}