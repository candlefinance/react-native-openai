import Foundation

struct ImageInput: Codable {
    let prompt: String
    var n: Int?
    var size: Image.Size?
    var user: String?
   
}
