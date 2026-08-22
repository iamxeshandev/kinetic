namespace kinetic_api.Dtos.Common;

public class Response(string message)
{
    public string Message => message;
}

public class Response<T>(string message, T data)
{
    public Response(T data) : this(string.Empty, data)
    {
    }

    public string Message { get; set; } = message;
    public T Data { get; } = data;
}