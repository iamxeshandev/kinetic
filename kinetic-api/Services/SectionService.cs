using System.Net;
using kinetic_api.Data;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Section;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace kinetic_api.Services;

public class SectionService(AppDbContext db, IHttpContextAccessor accessor, TaskService taskService)
{
    private const long PositionStep = 1000000;

    private async Task NormalizePositionsAsync(Guid workspaceId, Guid projectId)
    {
        var sections = await db.Sections
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .ToListAsync();

        var position = PositionStep;
        foreach (var section in sections)
        {
            section.Position = position;
            position += PositionStep;
        }

        await db.SaveChangesAsync();
    }

    public async Task<Response<List<SectionDto>>> GetAllSectionsAsync(Guid workspaceId, Guid projectId)
    {
        var records = await db.Sections
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .OrderBy(o => o.Position)
            .Select(o => new SectionDto(o.Id, o.Name))
            .ToListAsync();

        return new Response<List<SectionDto>>(records);
    }

    public async Task<Response<SectionDto>> GetSectionByIdAsync(Guid workspaceId, Guid projectId, Guid sectionId)
    {
        var record = await db.Sections
            .Where(o => o.Id == sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .Select(o => new SectionDto(o.Id, o.Name))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        return new Response<SectionDto>(record);
    }

    public async Task<Response<SectionDto>> CreateSectionAsync(Guid workspaceId, Guid projectId, SectionDto dto)
    {
        var projectExists = await db.Projects.AnyAsync(o => o.Id == projectId && o.WorkspaceId == workspaceId);
        if (!projectExists)
            throw new ApiException(HttpStatusCode.NotFound, "Project not found.");

        var lastPosition = await db.Sections
            .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .MaxAsync(o => (long?)o.Position) ?? 0L;

        var section = new Section
        {
            ProjectId = projectId,
            Name = dto.Name,
            Position = lastPosition + PositionStep,
            CreatedBy = accessor.GetUserId()
        };
        db.Sections.Add(section);

        await db.SaveChangesAsync();
        return new Response<SectionDto>("Section created.",
            await GetSectionByIdAsync(workspaceId, projectId, section.Id).TryGetDataAsync());
    }

    public async Task<Response<SectionDto>> UpdateSectionAsync(Guid workspaceId, Guid projectId, Guid sectionId,
        SectionDto dto)
    {
        var section = await db.Sections.SingleOrDefaultAsync(o =>
                          o.Id == sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        section.Name = dto.Name;
        section.UpdatedAt = DateTimeOffset.UtcNow;
        section.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SectionDto>("Section updated.",
            await GetSectionByIdAsync(workspaceId, projectId, sectionId).TryGetDataAsync());
    }

    public async Task<Response> MoveSectionAsync(Guid workspaceId, Guid projectId, Guid sectionId, MoveSectionDto dto)
    {
        var newPosition = dto switch
        {
            { PreviousSectionId: null } => (await db.Sections
                .Where(o => o.Id != sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .Select(o => (long?)o.Position)
                .MinAsync() ?? 2 * PositionStep) - PositionStep,

            { NextSectionId: null } => (await db.Sections
                .Where(o => o.Id != sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .Select(o => (long?)o.Position)
                .MaxAsync() ?? 0L) + PositionStep,

            _ => await db.Sections
                .Where(o =>
                    (o.Id == dto.PreviousSectionId.Value || o.Id == dto.NextSectionId.Value) &&
                    o.ProjectId == projectId &&
                    o.Project.WorkspaceId == workspaceId)
                .Select(o => o.Position)
                .ToListAsync() is { Count: 2 } positions
                ? positions.Sum() / 2
                : throw new ApiException(HttpStatusCode.BadRequest, "Invalid neighbouring sections.")
        };

        await db.Sections
            .Where(o => o.Id == sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .ExecuteUpdateAsync(s => s.SetProperty(o => o.Position, newPosition));

        return new Response("Section moved.");
    }

    public async Task<Response> DeleteSectionAsync(Guid workspaceId, Guid projectId, Guid sectionId,
        Guid? moveTasksTo, bool deleteTasks)
    {
        // Make single retriable strategy for custom transaction
        var strategy = db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync();

            try
            {
                var section = await db.Sections.SingleOrDefaultAsync(o =>
                                  o.Id == sectionId && o.ProjectId == projectId &&
                                  o.Project.WorkspaceId == workspaceId) ??
                              throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

                var hasTasks = await db.Tasks.AnyAsync(o =>
                    o.SectionId == sectionId && o.Section.ProjectId == projectId &&
                    o.Section.Project.WorkspaceId == workspaceId);

                if (hasTasks)
                {
                    if (moveTasksTo.HasValue)
                        await taskService.MoveSectionTasksAsync(workspaceId, projectId, sectionId, moveTasksTo.Value);
                    else if (deleteTasks)
                        await taskService.DeleteSectionTasksAsync(workspaceId, projectId, sectionId);
                    else
                        throw new ApiException(HttpStatusCode.BadRequest, "Cannot delete section with tasks.");
                }

                section.DeletedAt = DateTimeOffset.UtcNow;
                section.DeletedBy = accessor.GetUserId();

                await db.SaveChangesAsync();

                await transaction.CommitAsync();

                return new Response("Section deleted.");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
    }
}