using System.Net;
using kinetic_api.Database;
using kinetic_api.dtos;
using kinetic_api.dtos.Common;
using kinetic_api.Models;
using Microsoft.EntityFrameworkCore;

namespace kinetic_api.Repositories;

public class ProjectService(AppDbContext context)
{
    public async Task<ApiResponse<List<ProjectDto>>> GetAllProjectsAsync()
    {
        var records = await context.Projects.AsNoTracking().Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .ToListAsync();

        return new ApiResponse<List<ProjectDto>>(records);
    }

    public async Task<ApiResponse<ProjectDto>> GetProjectByIdAsync(Guid id)
    {
        var record = await context.Projects.AsNoTracking().Where(o => o.Id == id)
            .Select(o => new ProjectDto(o.Id, o.Name, o.Description))
            .FirstOrDefaultAsync() ?? throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        return new ApiResponse<ProjectDto>(record);
    }

    public async Task<ApiResponse<ProjectDto>> CreateProjectAsync(ProjectDto projectDto)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = projectDto.Name,
            Description = projectDto.Description,
            CreatedAt = DateTime.UtcNow
        };
        context.Add(project);
        await context.SaveChangesAsync();

        var response = await GetProjectByIdAsync(project.Id);
        return new ApiResponse<ProjectDto>(response.Data, "Project created");
    }

    public async Task<ApiResponse<ProjectDto>> UpdateProjectAsync(Guid id, ProjectDto projectDto)
    {
        var project = await context.Projects.FindAsync(id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        project.Name = projectDto.Name;
        project.Description = projectDto.Description;
        project.UpdatedAt = DateTime.UtcNow;

        context.Update(project);
        await context.SaveChangesAsync();

        var response = await GetProjectByIdAsync(project.Id);
        return new ApiResponse<ProjectDto>(response.Data, "Project updated.");
    }

    public async Task<ApiResponse> DeleteProjectAsync(Guid id)
    {
        var project = context.Projects.FirstOrDefault(o => o.Id == id) ??
                      throw new ApiException(HttpStatusCode.NotFound, "Project not found");

        context.Remove(project);
        await context.SaveChangesAsync();
        return new ApiResponse("Project deleted.");
    }
}