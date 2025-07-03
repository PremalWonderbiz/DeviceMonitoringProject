using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AlarmTableChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ResolvedAt",
                table: "Alarms",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "Alarms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AlarmStates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmStates", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alarms_StateId",
                table: "Alarms",
                column: "StateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alarms_AlarmStates_StateId",
                table: "Alarms",
                column: "StateId",
                principalTable: "AlarmStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alarms_AlarmStates_StateId",
                table: "Alarms");

            migrationBuilder.DropTable(
                name: "AlarmStates");

            migrationBuilder.DropIndex(
                name: "IX_Alarms_StateId",
                table: "Alarms");

            migrationBuilder.DropColumn(
                name: "ResolvedAt",
                table: "Alarms");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "Alarms");
        }
    }
}
