using System.Net;

namespace kinetic_api.dtos.Common;

public class ApiException(HttpStatusCode statusCode, string message) : Exception(message)
{
    public HttpStatusCode StatusCode => statusCode;
}