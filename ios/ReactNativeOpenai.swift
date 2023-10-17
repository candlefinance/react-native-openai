import React

@available(iOS 15.0, *)
@objc(ReactNativeOpenai)
final class ReactNativeOpenai: RCTEventEmitter {
    
    let urlSession = URLSession(configuration: .default)
    var configuration: Configuration?
    lazy var openAIClient = Client(session: urlSession, configuration: configuration!)
    
    @objc public static var emitter: RCTEventEmitter?
    
    private static var isInitialized = false
    
    private static var queue: [Action] = []
    
    @objc override init() {
        super.init()
        Self.emitter = self
    }
    
    @objc(initialize:organization:)
    public func initialize(apiKey: String, organization: String) {
        self.configuration = Configuration(apiKey: apiKey, organization: organization)
    }
    
    override public static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc public override func supportedEvents() -> [String] {
        ["onChatMessageReceived"]
    }
    
    struct Action {
        let type: String
        let payload: String
    }
    
    private static func sendStoreAction(_ action: Action) {
        if let emitter = self.emitter {
            emitter.sendEvent(withName: "onChatMessageReceived", body: [
                "type": action.type,
                "payload": action.payload
            ])
        }
    }
    
    @objc public static func dispatch(type: String, payload: String) {
        let actionObj = Action(type: type, payload: payload)
        if isInitialized {
            self.sendStoreAction(actionObj)
        } else {
            self.queue.append(actionObj)
        }
    }
    
    @objc public override func startObserving() {
        Self.isInitialized = true
        for event in Self.queue {
            Self.sendStoreAction(event)
        }
        Self.queue = []
    }
    
    @objc public override func stopObserving() {
        Self.isInitialized = false
    }
}

// MARK: - Chat
@available(iOS 15.0, *)
extension ReactNativeOpenai {
    @objc(stream:)
    public func stream(input: NSDictionary) {
        Task {
            do {
                let decoded = try DictionaryDecoder().decode(ChatInput.self, from: input)
                let completion = try await openAIClient.chats.stream(
                    model: decoded,
                    messages: decoded.toMessages,
                    temperature: decoded.temperature ?? 1,
                    topP: decoded.topP ?? 1,
                    n: decoded.n ?? 1,
                    stops: decoded.stops ?? [],
                    maxTokens: decoded.maxTokens,
                    presencePenalty: decoded.presencePenalty ?? 0,
                    frequencyPenalty: decoded.frequencyPenalty ?? 0,
                    logitBias: decoded.logitBias ?? [:],
                    user: decoded.user
                )
                for try await chat in completion {
                    if let payload = String(data: try JSONEncoder().encode(chat), encoding: .utf8) {
                        Self.dispatch(type: "onChatMessageReceived", payload: payload)
                    }
                }
            } catch {
                Self.dispatch(type: "onChatMessageReceived", payload: "Error: \(error.localizedDescription)")
            }
        }
    }
    
    @objc(create:withResolver:withRejecter:)
    public func create(input: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                let decoded = try DictionaryDecoder().decode(ChatInput.self, from: input)
                let completion = try await openAIClient.chats.create(
                    model: decoded,
                    messages: decoded.toMessages,
                    temperature: decoded.temperature ?? 1,
                    topP: decoded.topP ?? 1,
                    n: decoded.n ?? 1,
                    stops: decoded.stops ?? [],
                    maxTokens: decoded.maxTokens,
                    presencePenalty: decoded.presencePenalty ?? 0,
                    frequencyPenalty: decoded.frequencyPenalty ?? 0,
                    logitBias: decoded.logitBias ?? [:],
                    user: decoded.user
                )
                if let payload = String(data: try JSONEncoder().encode(completion), encoding: .utf8) {
                    resolve(payload)
                } else {
                    reject("error", "error", nil)
                }
            } catch {
                print(error)
                reject("error", "error", error)
            }
        }
    } 
}
