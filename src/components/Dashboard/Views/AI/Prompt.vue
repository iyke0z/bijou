<template>
    <div class="app-layout container mt-4">
      <!-- <h2 class="text-xl font-semibold mb-4">How can I assist you?</h2> -->
      <h2 class="text-xl font-semibold mb-4">AI Assistant coming soon!</h2>
  
      <!-- Chat Section -->
      <div class="chat-container border rounded p-4 bg-white shadow-md h-96 overflow-y-auto mb-4">
        <div v-for="(message, index) in messages" :key="index" class="mb-3">
          <div v-if="message.isUser" class="text-end">
            <strong>You:</strong>
            <div class="bg-light ml-4 text-dark px-3 py-2 rounded d-inline-block mt-1">
              {{ message.text }}
            </div>
          </div>
          <div v-else>
            <strong>Assistant:</strong>
            <div class="bg-light ml-4 text-dark px-3 py-2 rounded d-inline-block mt-1">
              <span v-if="!message.isUser" :class="{ 'typewriter': message.isTyping }">{{ message.text }}</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Input Section -->
      <form @submit.prevent="sendMessage" class="d-flex align-items-center">
        <input v-model="userInput" type="text" readonly placeholder="Type your prompt here..." class="form-control me-2" required />
        <button type="submit" class="btn btn-dark">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        messages: [],
        userInput: "how much have i made today?",
      };
    },
    methods: {
      sendMessage() {
        if (this.userInput.trim()) {
          this.messages.push({ text: this.userInput, isUser: true });
          this.userInput = "";
  
          setTimeout(() => {
            this.generateResponse();
          }, 1000);
        }
      },
      generateResponse() {
        const responses = {
          "how much have i made today?": 'You have made ₦125,000 today.',
        };
  
        const userLastMessage = this.messages[this.messages.length - 1].text.toLowerCase();
        const response = responses[userLastMessage] || 'Sorry, I don\'t have an answer for that yet.';
        this.messages.push({ text: response, isUser: false, isTyping:true });
      },
    },
    created(){
        this.sendMessage()
    }
  };
  </script>
  
  <style>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .topbar {
    background-color: #1a202c;
    color: white;
  }
  
  .sidebar {
    background-color: #2d3748;
    color: white;
  }
  
  .footer {
    background-color: #1a202c;
    color: white;
  }
  
  .main-content {
    flex-grow: 1;
  }
  
  .prompt-interface {
    max-width: 800px;
    margin: auto;
  }
  
  .chat-container {
    height: 60vh;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }
  
  .typewriter {
    display: inline-block;
    overflow: hidden;
    white-space:nowrap;
    /* word-break: break-all; */
    animation: typing 5s steps(40, end);
    cursor: none;
  }
  
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  </style>