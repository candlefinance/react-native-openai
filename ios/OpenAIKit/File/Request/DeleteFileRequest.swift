import Foundation

struct DeleteFileRequest: Request {
    let method: HTTPMethod = .delete
    let path: String
    
    init(id: String) {
        self.path = "/v1/files/\(id)"
    }
}

