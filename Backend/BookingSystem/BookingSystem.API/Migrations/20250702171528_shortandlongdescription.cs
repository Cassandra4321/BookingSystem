using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class shortandlongdescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "WorkoutClasses",
                newName: "ShortDescription");

            migrationBuilder.AddColumn<string>(
                name: "LongDescription",
                table: "WorkoutClasses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LongDescription",
                table: "WorkoutClasses");

            migrationBuilder.RenameColumn(
                name: "ShortDescription",
                table: "WorkoutClasses",
                newName: "Description");
        }
    }
}
