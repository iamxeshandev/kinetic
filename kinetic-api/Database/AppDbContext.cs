using System.Linq.Expressions;
using kinetic_api.Interfaces;
using kinetic_api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = kinetic_api.Models.Task;

namespace kinetic_api.Database;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Workspace> Workspaces { get; set; }
    public DbSet<WorkspaceMember> WorkspaceMembers { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Subtask> Subtasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            if (typeof(IAuditableEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType);
                var property = Expression.Property(parameter, nameof(IAuditableEntity.DeletedAt));
                var compareExpression = Expression.Equal(property, Expression.Constant(null, typeof(DateTime?)));
                var lambda = Expression.Lambda(compareExpression, parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }

        modelBuilder.Entity<WorkspaceMember>().HasKey(wm => new { wm.WorkspaceId, wm.UserId });
    }
}