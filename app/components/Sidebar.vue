<template>
  <aside class="sidebar">
    <!-- Menu Button -->
    <button class="menu-button" @click="toggleSidebar">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- New Chat Button -->
    <button class="new-chat-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      New chat
    </button>

    <!-- Scrollable Content Area -->
    <div class="sidebar-content">
      <!-- Projects Section -->
      <div class="section">
        <h3 class="section-title">Projects</h3>
        <div v-for="project in projects" :key="project.id" class="project">
          <div class="project-header" @click="toggleProject(project.id)">
            <svg 
              class="chevron" 
              :class="{ 'chevron-open': project.isOpen }"
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <span>{{ project.name }}</span>
          </div>
          <div v-if="project.isOpen" class="project-chats">
            <div 
              v-for="chat in project.chats" 
              :key="chat.id" 
              class="chat-item"
              :class="{ 'active': activeChat === chat.id }"
              @click="selectChat(chat.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {{ chat.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Chat History Section -->
      <div class="section">
        <h3 class="section-title">Chat History</h3>
        <div 
          v-for="chat in chatHistory" 
          :key="chat.id" 
          class="chat-item"
          :class="{ 'active': activeChat === chat.id }"
          @click="selectChat(chat.id)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {{ chat.name }}
        </div>
      </div>
    </div>

    <!-- Settings Button at Bottom -->
    <button class="settings-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m5.196-13.196l-4.242 4.242m0 5.657l4.242 4.242M23 12h-6m-6 0H1m18.196 5.196l-4.242-4.242m-5.657 0L4.804 17.196"></path>
      </svg>
      Settings
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Chat {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
  isOpen: boolean
  chats: Chat[]
}

const activeChat = ref<string | null>(null)

const projects = ref<Project[]>([
  {
    id: '1',
    name: 'Web Development',
    isOpen: true,
    chats: [
      { id: 'p1-c1', name: 'React Components' },
      { id: 'p1-c2', name: 'API Integration' },
      { id: 'p1-c3', name: 'State Management' }
    ]
  },
  {
    id: '2',
    name: 'Mobile App',
    isOpen: false,
    chats: [
      { id: 'p2-c1', name: 'Navigation Setup' },
      { id: 'p2-c2', name: 'User Authentication' }
    ]
  },
  {
    id: '3',
    name: 'Data Analysis',
    isOpen: false,
    chats: [
      { id: 'p3-c1', name: 'Data Cleaning' },
      { id: 'p3-c2', name: 'Visualization' }
    ]
  }
])

const chatHistory = ref<Chat[]>([
  { id: 'h1', name: 'General Questions' },
  { id: 'h2', name: 'Code Review' },
  { id: 'h3', name: 'Bug Fixing Help' },
  { id: 'h4', name: 'Performance Tips' }
])

const toggleSidebar = () => {
  // Sidebar toggle functionality can be implemented here
  console.log('Toggle sidebar')
}

const toggleProject = (projectId: string) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.isOpen = !project.isOpen
  }
}

const selectChat = (chatId: string) => {
  activeChat.value = chatId
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #202123;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #4d4d4f;
  overflow: hidden;
}

.menu-button {
  padding: 12px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: #2a2b32;
}

.new-chat-button {
  margin: 8px;
  padding: 12px;
  background: none;
  border: 1px solid #4d4d4f;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.new-chat-button:hover {
  background-color: #2a2b32;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #4d4d4f;
  border-radius: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #5d5d5f;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #8e8ea0;
  text-transform: uppercase;
  padding: 8px 12px;
  margin-bottom: 4px;
}

.project {
  margin-bottom: 8px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.project-header:hover {
  background-color: #2a2b32;
}

.chevron {
  transition: transform 0.2s;
  flex-shrink: 0;
}

.chevron-open {
  transform: rotate(90deg);
}

.project-chats {
  margin-left: 24px;
  margin-top: 4px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: background-color 0.2s;
  margin-bottom: 2px;
}

.chat-item:hover {
  background-color: #2a2b32;
}

.chat-item.active {
  background-color: #343541;
}

.settings-button {
  margin: 8px;
  padding: 12px;
  background: none;
  border: 1px solid #4d4d4f;
  border-top: 1px solid #4d4d4f;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background-color: #2a2b32;
}
</style>
