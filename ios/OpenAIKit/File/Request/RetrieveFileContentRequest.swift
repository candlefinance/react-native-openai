import Foundation

struct RetrieveFileContentRequest: Request {
    let method: HTTPMethod = .get
    let path: String
    
    init(id: String) {
        self.path = "/v1/files/\(id)/content"
    }
}

