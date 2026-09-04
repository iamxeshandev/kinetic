using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinetic_api.Migrations
{
    /// <inheritdoc />
    public partial class Migration4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Workspaces_DefaultWorkspaceId",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "DefaultWorkspaceId",
                table: "AspNetUsers",
                newName: "CurrentWorkspaceId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_DefaultWorkspaceId",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_CurrentWorkspaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Workspaces_CurrentWorkspaceId",
                table: "AspNetUsers",
                column: "CurrentWorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Workspaces_CurrentWorkspaceId",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "CurrentWorkspaceId",
                table: "AspNetUsers",
                newName: "DefaultWorkspaceId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_CurrentWorkspaceId",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_DefaultWorkspaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Workspaces_DefaultWorkspaceId",
                table: "AspNetUsers",
                column: "DefaultWorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id");
        }
    }
}
