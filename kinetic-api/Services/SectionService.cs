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

public class SectionService(AppDbContext db, IHttpContextAccessor accessor)
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

    public async Task<Response> DeleteSectionAsync(Guid workspaceId, Guid projectId, Guid sectionId)
    {
        var section = await db.Sections.SingleOrDefaultAsync(o =>
                          o.Id == sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        section.DeletedAt = DateTimeOffset.UtcNow;
        section.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Section deleted.");
    }

    public async Task<Response> MoveSectionAsync(Guid workspaceId, Guid projectId, Guid sectionId, MoveSectionDto dto)
    {
        // TODO: Handle the case where previous or next section not found in database.
        var newPosition = dto switch
        {
            { PreviousSectionId: null } => await db.Sections
                .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .MinAsync(o => o.Position) - PositionStep,

            { NextSectionId: null } => await db.Sections
                .Where(o => o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
                .MaxAsync(o => o.Position) + PositionStep,

            _ => await db.Sections.Where(o =>
                new List<Guid> { dto.PreviousSectionId.Value, dto.NextSectionId.Value }.Contains(o.Id) &&
                o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId).SumAsync(o => o.Position) / 2
        };

        await db.Sections
            .Where(o => o.Id == sectionId && o.ProjectId == projectId && o.Project.WorkspaceId == workspaceId)
            .ExecuteUpdateAsync(s => s.SetProperty(o => o.Position, newPosition));

        return new Response("Section moved.");
    }
}