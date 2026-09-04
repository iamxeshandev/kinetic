using kinetic_api.Dtos.Common;

namespace kinetic_api.Extensions;

public static class TaskExtensions
{
    public static async Task<T?> TryGetDataAsync<T>(this Task<Response<T>> task)
    {
        try
        {
            var response = await task;
            return response.Data;
        }
        catch
        {
            return default;
        }
    }
}