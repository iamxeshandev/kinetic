using System.Text.Json.Serialization;

namespace kinetic_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<EProjectRole>))]
public enum EProjectRole
{
    Member,
    Lead,
    Owner
}