namespace kinetic_api.dtos.Common;

public class ApiResponse(string message)
{
    public string Message => message;
}

public class ApiResponse<T>
{
    // Variant 1: Only data
    public ApiResponse(T data)
    {
        Message = string.Empty;
        Data = data;
    }

    // Variant 2: Both data and message
    public ApiResponse(T data, string message)
    {
        Data = data;
        Message = message;
    }

    public string Message { get; set; }
    public T Data { get; set; }
}