using kinetic_api.Dtos.Common;

namespace kinetic_api.Extensions;

public static class TaskExtensions
{
    public static async Task<T> GetDataAsync<T>(this Task<Response<T>> task)
    {
        var response = await task;
        return response.Data;
    }
}