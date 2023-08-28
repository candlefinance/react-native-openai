import Foundation

struct CreateTranslationRequest: Request {
    let method: HTTPMethod = .post
    let path = "/v1/audio/translations"
    let body: Data?
    private let boundary = UUID().uuidString
    
    var headers: HTTPHeaders {
        var headers = HTTPHeaders()
        headers.add(name: .contentType, value: "multipart/form-data; boundary=\(boundary)")
        return headers
    }
    
    init(
        file: Data,
        fileName: String,
        mimeType: MIMEType.Audio,
        model: ModelID,
        prompt: String?,
        responseFormat: String?,
        temperature: Double?
    ) {
        let builder = MultipartFormDataBuilder(boundary: boundary)
        
        builder.addDataField(
            fieldName:  "file",
            fileName: fileName,
            data: file,
            mimeType: mimeType.rawValue
        )
        
        builder.addTextField(named: "model", value: model.id)
        
        if let prompt = prompt {
            builder.addTextField(named: "prompt", value: prompt)
        }
        
        if let responseFormat = responseFormat {
            builder.addTextField(named: "response_format", value: responseFormat)
        }
        
        if let temperature = temperature {
            builder.addTextField(named: "temperature", value: String(temperature))
        }
        
        self.body = builder.build()
    }
}
