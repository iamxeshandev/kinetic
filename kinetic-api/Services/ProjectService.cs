using System.Net;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class ProjectService(AppDbContext dbContext, IHttpContextAccessor accessor)
{
    public async Task<Response<List<ProjectDto>>> GetAllProjectsAsync()
    {
        var records = await dbContext.Projects
            .AsNoTracking()
            .Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .ToListAsync();

        return new Response<List<ProjectDto>>(records);
    }

    public async Task<Response<ProjectDto>> GetProjectByIdAsync(Guid id)
    {
        var record = await dbContext.Projects
            .AsNoTracking()
            .Where(o => o.Id == id)
            .Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        return new Response<ProjectDto>(record);
    }

    public async Task<Response<ProjectDto>> CreateProjectAsync(ProjectDto projectDto)
    {
        var project = new Project
        {
            TeamId = Guid.NewGuid(),
            Name = projectDto.Name,
            Description = projectDto.Description,
            CreatedBy = accessor.GetUserId()
        };
        dbContext.Add(project);

        await dbContext.SaveChangesAsync();
        return new Response<ProjectDto>("Project created", (await GetProjectByIdAsync(project.Id)).Data);
    }

    public async Task<Response<ProjectDto>> UpdateProjectAsync(Guid id, ProjectDto projectDto)
    {
        var project = await dbContext.Projects.FindAsync(id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        project.Name = projectDto.Name;
        project.Description = projectDto.Description;
        project.UpdatedAt = DateTime.UtcNow;
        project.UpdatedBy = accessor.GetUserId();

        await dbContext.SaveChangesAsync();
        return new Response<ProjectDto>("Project updated.", (await GetProjectByIdAsync(project.Id)).Data);
    }

    public async Task<Response> DeleteProjectAsync(Guid id)
    {
        var project = dbContext.Projects.FirstOrDefault(o => o.Id == id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        project.DeletedAt = DateTime.UtcNow;
        project.DeletedBy = accessor.GetUserId();

        await dbContext.SaveChangesAsync();
        return new Response("Project deleted.");
    }
}