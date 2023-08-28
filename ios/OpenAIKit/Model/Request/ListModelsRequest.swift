import Foundation

struct ListModelsRequest: Request {
    let method: HTTPMethod = .get
    let path = "/v1/models"
}

