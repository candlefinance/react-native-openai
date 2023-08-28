public struct Configuration {
    public let apiKey: String
    public let organization: String?
    public let api: API?
    
    var headers: HTTPHeaders {
        var headers = HTTPHeaders()
        headers.add(name: .authorization, value: "Bearer \(apiKey)")

        if let organization = organization {
            headers.add(name: .openAIOrganization, value: organization)
        }
        
        return headers
    }
    
    public init(
        apiKey: String,
        organization: String? = nil,
        api: API? = nil
    ) {
        self.apiKey = apiKey
        self.organization = organization
        self.api = api
    }
    
}
