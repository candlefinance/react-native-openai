import Foundation

struct RetrieveFileRequest: Request {
    let method: HTTPMethod = .get
    let path: String
    
    init(id: String) {
        self.path = "/v1/files/\(id)"
    }
}


