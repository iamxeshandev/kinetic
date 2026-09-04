using System.Net;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Section;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class SectionService(AppDbContext db, HttpContextAccessor accessor)
{
    public async Task<Response<List<SectionDto>>> GetAllSectionsAsync(Guid projectId)
    {
        var records = await db.Sections
            .Where(o => o.ProjectId == projectId)
            .Select(o => new SectionDto(o.Id, o.Name))
            .ToListAsync();

        return new Response<List<SectionDto>>(records);
    }

    public async Task<Response<SectionDto>> GetSectionByIdAsync(Guid sectionId)
    {
        var record = await db.Sections
            .Where(o => o.Id == sectionId)
            .Select(o => new SectionDto(o.Id, o.Name))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        return new Response<SectionDto>(record);
    }

    public async Task<Response<SectionDto>> CreateSectionAsync(Guid projectId, SectionDto dto)
    {
        var section = new Section
        {
            ProjectId = projectId,
            Name = dto.Name,
            CreatedBy = accessor.GetUserId()
        };
        db.Sections.Add(section);

        await db.SaveChangesAsync();
        return new Response<SectionDto>("Section created.", await GetSectionByIdAsync(section.Id).TryGetDataAsync());
    }

    public async Task<Response<SectionDto>> UpdateSectionAsync(Guid sectionId, SectionDto dto)
    {
        var section = await db.Sections.FindAsync(sectionId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        section.Name = dto.Name;
        section.UpdatedAt = DateTimeOffset.UtcNow;
        section.UpdatedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response<SectionDto>("Section updated.", await GetSectionByIdAsync(section.Id).TryGetDataAsync());
    }

    public async Task<Response> DeleteSectionAsync(Guid sectionId)
    {
        var section = await db.Sections.FindAsync(sectionId) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Section not found.");

        section.DeletedAt = DateTimeOffset.UtcNow;
        section.DeletedBy = accessor.GetUserId();

        await db.SaveChangesAsync();
        return new Response("Section deleted.");
    }
}