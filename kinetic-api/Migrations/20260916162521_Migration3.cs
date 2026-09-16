using System;
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
            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "UserFavorites",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_UserFavorites_WorkspaceId",
                table: "UserFavorites",
                column: "WorkspaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavorites_Workspaces_WorkspaceId",
                table: "UserFavorites",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFavorites_Workspaces_WorkspaceId",
                table: "UserFavorites");

            migrationBuilder.DropIndex(
                name: "IX_UserFavorites_WorkspaceId",
                table: "UserFavorites");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "UserFavorites");
        }
    }
}
