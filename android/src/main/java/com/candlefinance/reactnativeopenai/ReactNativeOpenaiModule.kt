package com.candlefinance.reactnativeopenai

import com.aallam.openai.api.chat.ChatCompletionChunk
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.http.Timeout
import com.aallam.openai.api.image.ImageCreation
import com.aallam.openai.api.image.ImageSize
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.OpenAI
import com.aallam.openai.client.OpenAIConfig
import com.aallam.openai.client.OpenAIHost
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import java.util.Date
import java.util.HashMap
import kotlin.time.Duration.Companion.seconds

class ReactNativeOpenaiModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  val scope = CoroutineScope(Job() + Dispatchers.IO)
  var job: Job? = null

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
  fun initialize(config: ReadableMap) {
    val apiKey = if (config.hasKey("apiKey")) config.getString("apiKey") else null
    val organization = if (config.hasKey("organization")) config.getString("organization") else null
    val scheme = if (config.hasKey("scheme")) config.getString("scheme") else null
    val baseUrl = if (config.hasKey("host")) config.getString("host") else null
    val pathPrefix = if (config.hasKey("pathPrefix")) config.getString("pathPrefix") else null
    val host = baseUrl?.let {
      OpenAIHost(
        baseUrl = "${scheme ?: "https"}://${it}/${pathPrefix ?: "v1"}/"
      )
    }
    println(host)
    val config = OpenAIConfig(
      token = apiKey ?: "",
      organization = organization,
      timeout = Timeout(socket = 60.seconds),
      host = host ?: OpenAIHost.OpenAI
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
      stop = toList(stops),
      logitBias = toMap(logitBias)
    )
    runBlocking {
      job = scope.launch {
        val completion: Flow<ChatCompletionChunk>? = openAIClient?.chatCompletions(chatCompletionRequest)
        completion?.map { it }?.collect { completion ->
          println("completion ${completion.choices}")
          val map = mapOf(
            "id" to completion.id,
            "created" to completion.created,
            "model" to (completion.model?.id ?: "$model"),
            "choices" to (completion.choices?.map {
              mapOf(
                "delta" to mapOf(
                  "content" to (it.delta?.content ?: ""),
                  "role" to it.delta?.role.toString()
                ),
                "index" to it.index,
                "finishReason" to (it.finishReason ?: "stop")
              )
            } ?: {}),
          )
          dispatch(onChatMessageReceived, map)
        }
      }
    }
  }

  @ReactMethod
  fun create(input: ReadableMap, promise: Promise) {
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
      stop = toList(stops),
      logitBias = toMap(logitBias)
    )
    runBlocking {
      job = scope.launch {
        val completion = openAIClient?.chatCompletion(chatCompletionRequest)
        val map = mapOf(
          "id" to (completion?.id ?: ""),
          "created" to (completion?.created ?: ""),
          "model" to (completion?.model?.id ?: "$model"),
          "object" to "chat.completions",
          "choices" to (completion?.choices?.map {
            mapOf(
              "message" to mapOf(
                "content" to (it.message?.content ?: ""),
                "role" to it.message?.role.toString()
              ),
              "index" to it.index,
              "finishReason" to (it.finishReason.toString() ?: "stop")
            )
          } ?: {}),
          "usage" to mapOf(
            "promptTokens" to (completion?.usage?.promptTokens ?: 0),
            "totalTokens" to (completion?.usage?.totalTokens ?: 0),
            "completionTokens" to (completion?.usage?.completionTokens ?: 0)
          ),
        )
        val toReadableMap = Arguments.makeNativeMap(map)
        promise.resolve(toReadableMap)
      }
    }
  }

  @ReactMethod
  public fun imageCreate(input: ReadableMap,promise: Promise){
    val prompt = input.getString("prompt") as String;
    val n = if (input.hasKey("n")) input.getInt("n") else null
    val size = if (input.hasKey("n")) input.getString("size") else null

    runBlocking {
      job = scope.launch {
        var imageResult = openAIClient?.imageURL(creation = ImageCreation(prompt,n, ImageSize(size ?: "512x512")))
        val map = mapOf(
          "created" to Date().time,
          "data" to (imageResult?.map {
            mapOf(
              "url" to it.url
            )
          } ?: emptyList())
        )
        val toReadableMap = Arguments.makeNativeMap(map)
        promise.resolve(toReadableMap)
      }

    }

  }

  private fun toList(array: ReadableArray?): List<String> {
    val list = mutableListOf<String>()
    if (array != null) {
      for (i in 0 until array.size()) {
        list.add(array.getString(i) ?: "")
      }
    }
    return list
  }

  private fun toMap(map: ReadableMap?): Map<String, Int>? {
    val hashMap = mutableMapOf<String, Int>()
    if (map != null) {
      val iterator = map.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        hashMap[key] = map.getInt(key)
      }
    }
    return hashMap
  }

  private fun dispatch(action: String, payload: Map<String, Any?>) {
    val map = mapOf(
      "type" to action,
      "payload" to JSONObject(payload).toString()
    )
    val event: WritableMap = Arguments.makeNativeMap(map)
    reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(onChatMessageReceived, event)
  }
}
