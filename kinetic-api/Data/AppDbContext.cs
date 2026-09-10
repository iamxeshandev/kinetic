using System.Linq.Expressions;
using kinetic_api.Enums;
using kinetic_api.Interfaces;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserFavorite> UserFavorites { get; set; }
    public DbSet<Workspace> Workspaces { get; set; }
    public DbSet<WorkspaceMember> WorkspaceMembers { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Subtask> Subtasks { get; set; }
    public DbSet<TaskAttachment> TaskAttachments { get; set; }

    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
    {
        base.ConfigureConventions(builder);
        builder.Properties<Enum>().HaveConversion<string>();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(b =>
        {
            b.Property(u => u.UserName).IsRequired();
            b.Property(u => u.Email).IsRequired();
        });

        // Ensure only one Owner exist per workspace
        builder.Entity<WorkspaceMember>()
            .HasIndex(m => m.WorkspaceId)
            .HasFilter($"Role = '{nameof(EWorkspaceRole.Owner)}'")
            .IsUnique();

        // Ensure only one Owner exist per project
        builder.Entity<ProjectMember>()
            .HasIndex(m => m.ProjectId)
            .HasFilter($"Role = '{nameof(EProjectRole.Owner)}'")
            .IsUnique();

        // Composite Primary Keys
        builder.Entity<UserFavorite>().HasKey(uf => new { uf.UserId, uf.EntityId });
        builder.Entity<WorkspaceMember>().HasKey(wm => new { wm.WorkspaceId, wm.UserId });
        builder.Entity<ProjectMember>().HasKey(pm => new { pm.ProjectId, pm.UserId });

        // Filter soft deleted entities for every IAuditableEntity in queries
        foreach (var entityType in builder.Model.GetEntityTypes())
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType);
                var property = Expression.Property(parameter, nameof(ISoftDeletable.DeletedAt));
                var compareExpression = Expression.Equal(property, Expression.Constant(null, typeof(DateTime?)));
                var lambda = Expression.Lambda(compareExpression, parameter);

                builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }

        // Memberships must follow their required soft-deletable parent entities.
        builder.Entity<WorkspaceMember>().HasQueryFilter(member => member.Workspace.DeletedAt == null);
        builder.Entity<ProjectMember>().HasQueryFilter(member => member.Project.DeletedAt == null);
    }
}