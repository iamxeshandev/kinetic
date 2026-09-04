using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinetic_api.Migrations
{
    /// <inheritdoc />
    public partial class Migration3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPersonalWorkspace",
                table: "Workspaces",
                newName: "IsPersonal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPersonal",
                table: "Workspaces",
                newName: "IsPersonalWorkspace");
        }
    }
}
