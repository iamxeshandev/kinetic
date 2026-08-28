using System.Text.Json.Serialization;
using kinetic_api.Authorization;
using kinetic_api.Database;
using kinetic_api.Enums;
using kinetic_api.Middlewares;
using kinetic_api.Models;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Database Config
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options
        .UseSqlite("Data Source=kinetic.db")
        .EnableDetailedErrors()
        .LogTo(Console.WriteLine, LogLevel.Information);
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<WorkspaceService>();
builder.Services.AddScoped<ProjectService>();

// Controllers Config
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddHttpContextAccessor();

// Identity Config
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredLength = 8;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Authorization Policies
builder.Services.AddScoped<IAuthorizationHandler, MinimumRoleHandler>();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("WorkspaceMember",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Member)
        )))
    .AddPolicy("WorkspaceManager",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Manager)
        )))
    .AddPolicy("WorkspaceAdmin",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Admin)
        )))
    .AddPolicy("WorkspaceOwner",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Owner)
        )))
    .AddPolicy("WorkspaceManagerOrProjectLead",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Manager),
            (nameof(ProjectMember), EProjectRole.Lead)
        )))
    .AddPolicy("WorkspaceAdminOrProjectLead",
        policy => policy.Requirements.Add(new MinimumRoleRequirement(
            (nameof(WorkspaceMember), EWorkspaceRole.Admin),
            (nameof(ProjectMember), EProjectRole.Lead)
        )));

// Cors Config
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>()!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var app = builder.Build();

app.UsePathBase("/api");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors();

app.UseMiddleware<ApiExceptionHandlerMiddleware>();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();