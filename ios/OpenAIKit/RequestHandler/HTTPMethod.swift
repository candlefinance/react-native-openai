/**
 Enum to represent a HTTP request method.

 Generated from https://developer.mozilla.org/de/docs/Web/HTTP/Methods
 */
public enum HTTPMethod: String {

    /** The GET method requests a representation of the specified resource. Requests using GET should only retrieve data. */
    case get = "GET"

    /**
     The HEAD method asks for a response identical to that of a GET request, but without the response body.
     */
    case head = "HEAD"

    /**
     The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    case post = "POST"

    /**
     The PUT method replaces all current representations of the target resource with the request payload.
     */
    case put = "PUT"

    /**
     The DELETE method deletes the specified resource.
     */
    case delete = "DELETE"

    /**
     The CONNECT method establishes a tunnel to the server identified by the target resource.
     */
    case connect = "CONNECT"

    /**
     The TRACE method performs a message loop-back test along the path to the target resource.
     */
    case trace = "TRACE"

    /**
     The OPTIONS method is used to describe the communication options for the target resource.
     */
    case options = "OPTIONS"

    /**
     The PATCH method is used to apply partial modifications to a resource.
     */
    case patch = "PATCH"

}
