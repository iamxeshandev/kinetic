using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinetic_api.Migrations
{
    /// <inheritdoc />
    public partial class AddRefIdAndProjectIdInTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Sections_SectionId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_SectionId",
                table: "Tasks");

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "Tasks",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "RefId",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId_RefId",
                table: "Tasks",
                columns: new[] { "ProjectId", "RefId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ProjectId_RefId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "RefId",
                table: "Tasks");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_SectionId",
                table: "Tasks",
                column: "SectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Sections_SectionId",
                table: "Tasks",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
