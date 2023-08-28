import React

@available(iOS 15.0, *)
@objc(ReactNativeOpenai)
final class ReactNativeOpenai: RCTEventEmitter {
    
    struct Action {
        var action: String
        var payload: Any!
    }
    
    let urlSession = URLSession(configuration: .default)
    var configuration: Configuration?
    lazy var openAIClient = Client(session: urlSession, configuration: configuration!)
    
    @objc public static var emitter: RCTEventEmitter?
    
    private static var isInitialized = false
    
    private static var queue: [Action] = []
    
    private static let onMessageRecived = "onMessageReceived"
    
    @objc override init() {
        super.init()
        Self.emitter = self
    }
    
    @objc(initialize:organization:)
    public func initialize(apiKey: String, organization: String) {
        self.configuration = Configuration(apiKey: apiKey, organization: organization)
    }
    
    @objc public override func constantsToExport() -> [AnyHashable : Any]! {
        return ["ON_STORE_ACTION": Self.onMessageRecived]
    }
    
    override public static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc public override func supportedEvents() -> [String] {
        [Self.onMessageRecived]
    }
    
    private static func sendStoreAction(_ action: Action) {
        if let emitter = self.emitter {
            emitter.sendEvent(withName: onMessageRecived, body: [
                "type": action.action,
                "payload": action.payload
            ])
        }
    }
    
    @objc public static func dispatch(action: String, payload: Any!) {
        let actionObj = Action(action: action, payload: payload)
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

@available(iOS 15.0, *)
extension ReactNativeOpenai {
    @objc(stream:)
    public func stream(prompt: String) {
        Task {
            do {
                let completion = try await openAIClient.chats.stream(
                    model: Model.GPT3.gpt3_5Turbo,
                    messages: [.user(content: prompt)]
                )
                for try await chat in completion {
                if let streamMessage = chat.choices.first?.delta.content {
                    print("Stream message: \(streamMessage)")
                    Self.dispatch(action: Self.onMessageRecived, payload: [
                        "message": streamMessage
                    ])
                }
                }
            } catch {
                print("j",error)
            }
        }
    }
    
}
