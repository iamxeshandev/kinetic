using System.Net;
using System.Security.Claims;
using kinetic_api.Database;
using kinetic_api.Dtos.Common;
using kinetic_api.Dtos.Project;
using kinetic_api.Exceptions;
using kinetic_api.Extensions;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Services;

public class ProjectService(AppDbContext context, IHttpContextAccessor accessor)
{
    public async Task<Response<List<ProjectDto>>> GetAllProjectsAsync()
    {
        var records = await context.Projects.AsNoTracking().Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .ToListAsync();

        return new Response<List<ProjectDto>>(records);
    }

    public async Task<Response<ProjectDto>> GetProjectByIdAsync(Guid id)
    {
        var record = await context.Projects.AsNoTracking().Where(o => o.Id == id)
            .Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        return new Response<ProjectDto>(record);
    }

    public async Task<Response<ProjectDto>> CreateProjectAsync(ProjectDto projectDto)
    {
        var project = new Project
        {
            Name = projectDto.Name,
            Description = projectDto.Description,
            CreatedBy = accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToGuid()
        };
        context.Add(project);
        await context.SaveChangesAsync();

        var response = await GetProjectByIdAsync(project.Id);
        return new Response<ProjectDto>("Project created", response.Data);
    }

    public async Task<Response<ProjectDto>> UpdateProjectAsync(Guid id, ProjectDto projectDto)
    {
        var project = await context.Projects.FindAsync(id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        project.Name = projectDto.Name;
        project.Description = projectDto.Description;
        project.UpdatedAt = DateTime.UtcNow;
        project.UpdatedBy = accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToGuid();

        context.Update(project);
        await context.SaveChangesAsync();

        var response = await GetProjectByIdAsync(project.Id);
        return new Response<ProjectDto>("Project updated.", response.Data);
    }

    public async Task<Response> DeleteProjectAsync(Guid id)
    {
        var project = context.Projects.FirstOrDefault(o => o.Id == id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        project.DeletedAt = DateTime.UtcNow;
        project.DeletedBy = accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToGuid();

        context.Update(project);
        await context.SaveChangesAsync();

        return new Response("Project deleted.");
    }
}