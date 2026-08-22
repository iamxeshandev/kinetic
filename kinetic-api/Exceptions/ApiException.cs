using System.Net;

namespace kinetic_api.Exceptions;

public class ApiException(HttpStatusCode statusCode, string message) : Exception(message)
{
    public HttpStatusCode StatusCode => statusCode;
}

public class ApiException<T>(HttpStatusCode statusCode, string message, T errors) : ApiException(statusCode, message)
{
    public T Errors => errors;
}