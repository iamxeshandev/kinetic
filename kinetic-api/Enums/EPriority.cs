using System.Text.Json.Serialization;

namespace kinetic_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<EPriority>))]
public enum EPriority
{
    None,
    Low,
    Medium,
    High
}