namespace kinetic_api.Dtos.Common;

public record LookupDto<T>(T Value, string Label);