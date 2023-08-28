import Foundation

struct JSMessage: Codable {
    let role: String
    let content: String
}

struct ChatInput: Codable, ModelID {
    let model: String
    var messages: [JSMessage]
    let temperature: Double?
    let topP: Double?
    let n: Int?
    let stops: [String]?
    var maxTokens: Int?
    var presencePenalty: Double?
    var frequencyPenalty: Double?
    var logitBias: [String : Int]?
    var user: String?
    
    var id: String {
        model
    }
    
    var toMessages: [Chat.Message] {
        messages.map { message in
            switch message.role {
            case "system":
                return .system(content: message.content)
            case "user":
                return .user(content: message.content)
            default:
                return .assistant(content: message.content)
            }
        }
    }
}
