import React
import OpenAIKit

@objc(ReactNativeOpenai)
final class ReactNativeOpenai: RCTEventEmitter {
    
    struct Action {
        var action: String
        var payload: Any!
    }
    
    private var openAI: OpenAIKit?
    
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
        self.openAI = OpenAIKit(apiToken: apiKey, organization: organization)
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

extension ReactNativeOpenai {
    @objc(stream:)
    public func stream(prompt: String) {
        guard let openAI = self.openAI else {
            fatalError("OpenAI is not initialized, add initialize method to your app")
            return
        }
        print("start streaming.....")
        openAI.sendStreamChatCompletion(
            newMessage: AIMessage(role: .user, content: prompt),
            model: .gptV3_5(.gptTurbo),
            maxTokens: 2048
        ) { result in
            switch result {
            case .success(let streamResult):
                if let streamMessage = streamResult.message?.choices.first?.message {
                    print("Stream message: \(streamMessage)")
                    Self.dispatch(action: Self.onMessageRecived, payload: [
                        "message": streamMessage.content
                    ])
                }
            case .failure(let error):
                print(error)
            }
        }
    }
    
}
