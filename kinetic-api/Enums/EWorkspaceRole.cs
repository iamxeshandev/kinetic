using System.Text.Json.Serialization;

namespace kinetic_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<EWorkspaceRole>))]
public enum EWorkspaceRole
{
    Member,
    Manager,
    Admin,
    Owner
}