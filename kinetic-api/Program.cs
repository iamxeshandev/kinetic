using System.Text.Json.Serialization;
using kinetic_api.Authorization;
using kinetic_api.Configuration;
using kinetic_api.Data;
using kinetic_api.Enums;
using kinetic_api.Middlewares;
using kinetic_api.Models;
using kinetic_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddHttpContextAccessor();


// Storage Config
builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection("Storage"));


// Database Config
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options
        .UseAzureSql(builder.Configuration.GetConnectionString("DefaultConnection"))
        .EnableDetailedErrors()
        .LogTo(Console.WriteLine, LogLevel.Information);
});


// App Services Config
builder.Services.AddSingleton<StorageService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<WorkspaceService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SectionService>();
builder.Services.AddScoped<TaskService>();


// Controllers Config
builder
    .Services.AddControllers()
    .AddJsonOptions(options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });


// Identity Config
builder
    .Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
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
builder.Services.AddScoped<IAuthorizationHandler, WorkspaceTypeHandler>();
builder
    .Services.AddAuthorizationBuilder()
    .AddPolicy(
        "WorkspaceMember",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement((nameof(WorkspaceMember), EWorkspaceRole.Member))
            )
    )
    .AddPolicy(
        "WorkspaceManager",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement((nameof(WorkspaceMember), EWorkspaceRole.Manager))
            )
    )
    .AddPolicy(
        "WorkspaceAdmin",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement((nameof(WorkspaceMember), EWorkspaceRole.Admin))
            )
    )
    .AddPolicy(
        "WorkspaceOwner",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement((nameof(WorkspaceMember), EWorkspaceRole.Owner))
            )
    )
    .AddPolicy(
        "WorkspaceAdminOrProjectOwner",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement(
                    (nameof(WorkspaceMember), EWorkspaceRole.Admin),
                    (nameof(ProjectMember), EProjectRole.Owner)
                )
            )
    )
    .AddPolicy(
        "WorkspaceAdminOrProjectLead",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement(
                    (nameof(WorkspaceMember), EWorkspaceRole.Admin),
                    (nameof(ProjectMember), EProjectRole.Lead)
                )
            )
    )
    .AddPolicy(
        "WorkspaceManagerOrProjectLead",
        policy =>
            policy.Requirements.Add(
                new MinimumRoleRequirement(
                    (nameof(WorkspaceMember), EWorkspaceRole.Manager),
                    (nameof(ProjectMember), EProjectRole.Lead)
                )
            )
    )
    .AddPolicy(
        "NonPersonalWorkspaceMember",
        policy =>
        {
            policy.Requirements.Add(new WorkspaceTypeRequirement(false));
            policy.Requirements.Add(
                new MinimumRoleRequirement((nameof(WorkspaceMember), EWorkspaceRole.Member))
            );
        }
    );


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    await DbSeeder.SeedAsync(scope.ServiceProvider, app.Environment.IsDevelopment());
}

app.UseDefaultFiles();
app.UseStaticFiles();


// Serve public static files
var storageService = app.Services.GetRequiredService<StorageService>();
var publicStoragePath = storageService.GetPublicPath();
var privateStoragePath = storageService.GetPrivatePath();

Directory.CreateDirectory(publicStoragePath);
Directory.CreateDirectory(privateStoragePath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(publicStoragePath),
    RequestPath = "/storage/public"
});


// Apply database migrations
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
    app.UseCors(policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
}

app.UseMiddleware<ApiExceptionHandlerMiddleware>();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();