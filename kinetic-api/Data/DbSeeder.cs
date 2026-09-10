using kinetic_api.Enums;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace kinetic_api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services, bool isDevelopment)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        if (isDevelopment && !await db.Users.AnyAsync()) await SeedMockDataAsync(userManager, db);
    }

    private static async Task SeedMockDataAsync(UserManager<ApplicationUser> userManager, AppDbContext db)
    {
        var users = new List<ApplicationUser>
        {
            new()
            {
                UserName = "johndoe@example.com",
                Email = "johndoe@example.com",
                FirstName = "John",
                LastName = "Doe"
            },
            new()
            {
                UserName = "janesmith@example.com",
                Email = "janesmith@example.com",
                FirstName = "Jane",
                LastName = "Smith"
            },
            new()
            {
                UserName = "charliebrown@example.com",
                Email = "charliebrown@example.com",
                FirstName = "Charlie",
                LastName = "Brown"
            },
            new()
            {
                UserName = "davidwyatt@example.com",
                Email = "davidwyatt@example.com",
                FirstName = "David",
                LastName = "Wyatt"
            }
        };

        foreach (var user in users)
        {
            await userManager.CreateAsync(user, "Password@123");
            var personalWorkspace = new Workspace
            {
                Id = Guid.NewGuid(),
                Name = "Personal Workspace",
                IsPersonal = true,
                CreatedBy = user.Id
            };
            db.Workspaces.Add(personalWorkspace);

            var personalWorkspaceMembership = new WorkspaceMember
            {
                WorkspaceId = personalWorkspace.Id,
                UserId = user.Id,
                Role = EWorkspaceRole.Owner,
                CreatedBy = user.Id
            };
            db.WorkspaceMembers.Add(personalWorkspaceMembership);
        }

        var userId = users[0].Id;

        var workspace = new Workspace
        {
            Id = Guid.NewGuid(),
            Name = "Kinetic",
            CreatedBy = userId
        };
        db.Workspaces.Add(workspace);

        var workspaceMembers = new List<WorkspaceMember>
        {
            new()
            {
                WorkspaceId = workspace.Id,
                UserId = users[0].Id,
                Role = EWorkspaceRole.Owner,
                CreatedBy = userId
            },
            new()
            {
                WorkspaceId = workspace.Id,
                UserId = users[1].Id,
                Role = EWorkspaceRole.Admin,
                CreatedBy = userId
            },
            new()
            {
                WorkspaceId = workspace.Id,
                UserId = users[2].Id,
                Role = EWorkspaceRole.Member,
                CreatedBy = userId
            },
            new()
            {
                WorkspaceId = workspace.Id,
                UserId = users[3].Id,
                Role = EWorkspaceRole.Member,
                CreatedBy = userId
            }
        };
        db.WorkspaceMembers.AddRange(workspaceMembers);

        var project = new Project
        {
            WorkspaceId = workspace.Id,
            Name = "Kinetic App Development",
            Status = EProjectStatus.Active,
            Priority = EPriority.None,
            CreatedBy = userId
        };
        db.Projects.Add(project);

        var projectMembers = new List<ProjectMember>
        {
            new()
            {
                ProjectId = project.Id,
                UserId = users[1].Id,
                Role = EProjectRole.Owner
            },
            new()
            {
                ProjectId = project.Id,
                UserId = users[2].Id,
                Role = EProjectRole.Lead
            },
            new()
            {
                ProjectId = project.Id,
                UserId = users[3].Id,
                Role = EProjectRole.Member
            }
        };
        db.ProjectMembers.AddRange(projectMembers);

        await db.SaveChangesAsync();
    }
}