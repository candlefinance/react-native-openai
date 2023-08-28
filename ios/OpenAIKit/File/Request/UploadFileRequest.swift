import Foundation

struct UploadFileRequest: Request {
    let method: HTTPMethod = .post
    let path = "/v1/files"
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
        purpose: File.Purpose
    ) {
        let builder = MultipartFormDataBuilder(boundary: boundary)
        
        builder.addDataField(
            fieldName:  "file",
            fileName: fileName,
            data: file,
            mimeType: MIMEType.File.json.rawValue
        )
        
        builder.addTextField(named: "purpose", value: purpose.rawValue)
        
        self.body = builder.build()
    }
}

