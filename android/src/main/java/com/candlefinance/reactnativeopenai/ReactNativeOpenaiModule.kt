package com.candlefinance.reactnativeopenai

import android.provider.ContactsContract.CommonDataKinds.Organization
import com.aallam.openai.api.chat.ChatCompletion
import com.aallam.openai.api.chat.ChatCompletionChunk
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.http.Timeout
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.OpenAI
import com.aallam.openai.client.OpenAIConfig
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonNull.content
import org.json.JSONObject
import java.util.HashMap
import kotlin.time.Duration.Companion.seconds

class ReactNativeOpenaiModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val onChatMessageReceived = "onChatMessageReceived"
    const val NAME = "ReactNativeOpenai"
  }

  override fun getConstants() = mapOf(
    "onChatMessageReceived" to onChatMessageReceived
  )

  @ReactMethod
  fun addListener(eventName: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
    println("Event is called for $eventName")
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
    println("Remove event is called for $count")
  }

  private var openAIClient: OpenAI? = null

  @ReactMethod
  fun initialize(apiKey: String, organization: String) {
    println("Initializing client with $apiKey and org $organization")
    val config = OpenAIConfig(
      token = apiKey,
      organization = organization,
      timeout = Timeout(socket = 60.seconds)
    )
    this.openAIClient = OpenAI(config)
  }

  @ReactMethod
  fun stream(input: ReadableMap) {
    val model = input.getString("model")
    val messages = input.getArray("messages")
    val temperature = if (input.hasKey("temperature")) input.getDouble("temperature") else null
    val topP = if (input.hasKey("topP")) input.getDouble("topP") else null
    val n = if (input.hasKey("n")) input.getInt("n") else null
    val stops = if (input.hasKey("stops")) input.getArray("stops") else null
    val maxTokens = if (input.hasKey("maxTokens")) input.getInt("maxTokens") else null
    val presencePenalty = if (input.hasKey("presencePenalty")) input.getDouble("presencePenalty") else null
    val frequencyPenalty = if (input.hasKey("frequencyPenalty")) input.getDouble("frequencyPenalty") else null
    val logitBias = if (input.hasKey("logitBias")) input.getMap("logitBias") else null
    val user = if (input.hasKey("user")) input.getString("user") else null
    val m = messages?.toArrayList()?.map { it ->
      val role: String = (it as HashMap<String, String>).get("role") ?: "user"
      val content: String = it.get("content") as String
      ChatMessage(
        role = ChatRole(role),
        content = content
      )
    } ?: emptyList()

    val chatCompletionRequest = ChatCompletionRequest(
      model = ModelId(model ?: "gpt-3.5-turbo"),
      messages = m,
      maxTokens = maxTokens,
      temperature = temperature,
      topP = topP,
      n = n,
      presencePenalty = presencePenalty,
      frequencyPenalty = frequencyPenalty,
      user = user,
    )
    runBlocking {
      val completion: Flow<ChatCompletionChunk>? = openAIClient?.chatCompletions(chatCompletionRequest)
      completion?.map { it }?.collect {
        println("completion ${it.choices}")
        val map = mapOf(
          "id" to it.id,
          "created" to it.created,
          "model" to (it.model?.id ?: "$model"),
          "choices" to (it.choices?.map {
            mapOf(
              "delta" to mapOf(
                "content" to it.delta.content,
                "role" to it.delta.role.toString()
              ),
              "index" to it.index,
              "finishReason" to (it.finishReason?.value ?: "stop")
            )
          } ?: {}),
        )
        dispatch(onChatMessageReceived, map)
      }
    }
  }

  fun dispatch(action: String, payload: Map<String, Any?>) {
    val map = mapOf(
      "type" to action,
      "payload" to JSONObject(payload).toString()
    )
    val event: WritableMap = Arguments.makeNativeMap(map)
    reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(onChatMessageReceived, event)
  }
}
