using System.Text.Json.Serialization;

namespace kinetic_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<EProjectStatus>))]
public enum EProjectStatus
{
    Planning,
    Active,
    OnHold,
    Archived
}