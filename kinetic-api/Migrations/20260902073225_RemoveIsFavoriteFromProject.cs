using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinetic_api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsFavoriteFromProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "Projects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
