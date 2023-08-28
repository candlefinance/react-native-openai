import Foundation

struct ListFilesRequest: Request {
    let method: HTTPMethod = .get
    let path = "/v1/files"
}

