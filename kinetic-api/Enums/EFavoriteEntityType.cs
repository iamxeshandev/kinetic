using System.Text.Json.Serialization;

namespace kinetic_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<EFavoriteEntityType>))]
public enum EFavoriteEntityType
{
    Project
}