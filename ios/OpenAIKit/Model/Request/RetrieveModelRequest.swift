import Foundation

struct RetrieveModelRequest: Request {
    let method: HTTPMethod = .get
    let path: String
    
    init(id: String) {
        self.path = "/v1/models/\(id)"
    }
}


