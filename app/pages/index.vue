<template>
  <div class="chat-container">
    <!-- Chat Messages Area -->
    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="welcome-screen">
        <h1 class="welcome-title">AI Console</h1>
        <p class="welcome-subtitle">How can I help you today?</p>
        
        <div class="example-prompts">
          <button 
            v-for="example in examplePrompts" 
            :key="example.id"
            class="example-prompt"
            @click="useExample(example.text)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ example.text }}
          </button>
        </div>
      </div>

      <div v-else class="messages-list">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message"
          :class="message.role"
        >
          <div class="message-avatar">
            <svg v-if="message.role === 'user'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown="handleKeydown"
          placeholder="Send a message..."
          rows="1"
          class="message-input"
          ref="textareaRef"
        ></textarea>
        <button 
          class="send-button"
          :disabled="!inputMessage.trim()"
          @click="sendMessage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <p class="input-footer">
        AI Console can make mistakes. Check important info.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ExamplePrompt {
  id: string
  text: string
}

const messages = ref<Message[]>([])
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const examplePrompts = ref<ExamplePrompt[]>([
  { id: '1', text: 'Help me debug a code issue' },
  { id: '2', text: 'Explain a complex concept' },
  { id: '3', text: 'Write a function for me' },
  { id: '4', text: 'Review my code' }
])

const useExample = (text: string) => {
  inputMessage.value = text
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value
  }

  messages.value.push(userMessage)
  const currentInput = inputMessage.value
  inputMessage.value = ''

  // Auto-resize textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  // Simulate AI response
  await nextTick()
  scrollToBottom()

  setTimeout(() => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I received your message: "${currentInput}". This is a demo response. In a real application, this would be connected to an AI service.`
    }
    messages.value.push(assistantMessage)
    nextTick(() => scrollToBottom())
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-resize textarea
watch(inputMessage, () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #343541;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #4d4d4f;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #5d5d5f;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #10a37f 0%, #1aa179 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 18px;
  color: #c5c5d2;
  margin-bottom: 40px;
}

.example-prompts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 600px;
}

.example-prompt {
  padding: 16px;
  background-color: #444654;
  border: 1px solid #565869;
  border-radius: 8px;
  color: #ececf1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  text-align: left;
  transition: all 0.2s;
}

.example-prompt:hover {
  background-color: #4d4d5f;
  border-color: #6e6e80;
}

.messages-list {
  max-width: 800px;
  margin: 0 auto;
}

.message {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid #444654;
}

.message.user {
  background-color: #343541;
}

.message.assistant {
  background-color: #444654;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #19c37d;
}

.message.user .message-avatar {
  background-color: #5436da;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-text {
  color: #ececf1;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.input-container {
  padding: 20px;
  background-color: #343541;
  border-top: 1px solid #444654;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: flex-end;
  background-color: #40414f;
  border: 1px solid #565869;
  border-radius: 12px;
  padding: 12px;
  gap: 8px;
}

.message-input {
  flex: 1;
  background: none;
  border: none;
  color: #ececf1;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;
  max-height: 200px;
  overflow-y: auto;
  line-height: 24px;
}

.message-input::placeholder {
  color: #8e8ea0;
}

.message-input::-webkit-scrollbar {
  width: 8px;
}

.message-input::-webkit-scrollbar-track {
  background: transparent;
}

.message-input::-webkit-scrollbar-thumb {
  background: #565869;
  border-radius: 4px;
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background-color: #19c37d;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #1aa179;
}

.send-button:disabled {
  background-color: #565869;
  cursor: not-allowed;
}

.input-footer {
  text-align: center;
  font-size: 12px;
  color: #8e8ea0;
  margin-top: 12px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
</style>
