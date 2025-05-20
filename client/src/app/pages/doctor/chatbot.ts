import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

interface ChatMessage {
  sender: 'user' | 'bot' | 'assistant';
  text: string;
  timestamp: Date;
  image?: string; // Base64 encoded image if present
}

interface ChatSession {
  sessionId: string;
  timestamp: string;
  lastMessage?: string;
}

interface ApiChatMessage {
  id: number;
  sessionId: string;
  userId: string;
  sender: string;
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-patient-appointment',
  standalone: true,
  imports: [
    RouterModule,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    AvatarModule,
    ScrollPanelModule,
    CardModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    FileUploadModule,
    ToastModule,
    SidebarModule,
    MenuModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
<div class="flex h-screen bg-gray-100 dark:bg-gray-800">
  <!-- Background wrapper - contains everything -->
  <div class="flex w-full h-[88%]" style="background-image: url('https://img.freepik.com/free-photo/nurse-measuring-patient-blood-pressure_53876-14933.jpg?t=st=1746481571~exp=1746485171~hmac=6887fffbca219bb846598fd0fe0b0f44a9b6bcca8c7bc543e8f12fea2b4c040a&w=1380'); background-size: cover; background-position: center;">
    
    <!-- Fixed width sidebar -->
    <div class="sidebar h-full bg-white dark:bg-gray-900 shadow-lg w-64 flex flex-col" style="min-width: 250px;">
      <div class="p-3 bg-primary text-white flex justify-between items-center">
        <h2 class="text-xl font-bold m-0">Health Chats</h2>
        <button pButton icon="pi pi-plus" class="p-button-rounded p-button-sm" (click)="createNewSession()"></button>
      </div>
      
      <div class="p-3 overflow-y-auto flex-grow">
        <div *ngIf="chatSessions.length === 0" class="text-center text-gray-500 my-4">
          No chat sessions found.
        </div>
        
        <div *ngFor="let session of chatSessions" 
             class="chat-session p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
             [ngClass]="{'bg-blue-100 dark:bg-slate-950': currentSessionId === session.sessionId}"
             (click)="loadSession(session.sessionId)">
          <div class="flex items-center">
            <p-avatar icon="pi pi-comments" styleClass="mr-2"></p-avatar>
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{ session.sessionId }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(session.timestamp) }}</span>
              </div>
              <div class="text-sm text-gray-500 truncate">
                {{ session.lastMessage || 'No messages yet' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <button pButton label="New Chat" icon="pi pi-plus" class="p-button-text p-button-sm w-full" (click)="createNewSession()"></button>
      </div>
    </div>
    
    <!-- Main chat area -->
    <div class="flex-grow flex flex-col h-full p-4 mx-10">
      <div class="bg-surface-0 dark:bg-surface-900 flex flex-col w-full h-full rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 bg-primary shadow-md">
          <div class="flex items-center gap-2">
            <i class="pi pi-comments text-white text-xl"></i>
            <h2 class="text-white font-bold text-xl m-0">Health Assistant</h2>
            <div class="text-white text-sm opacity-70 ml-2">Session: {{ currentSessionId }}</div>
          </div>

        </div>
        
        <!-- Chat messages container -->
        <div class="flex-grow overflow-y-auto p-4" style="max-height: calc(100% - 130px); scroll-behavior: smooth;">
          <div *ngIf="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
            <i class="pi pi-comments text-4xl mb-2"></i>
            <p>No messages in this chat session</p>
            <button pButton label="Start Conversation" class="p-button-sm mt-3" (click)="focusMessageInput()"></button>
          </div>
          
          <div *ngFor="let message of messages" 
              class="mb-4 flex w-full" 
              [ngClass]="{'justify-end': message.sender === 'user'}">
            <div class="flex gap-2 max-w-[75%]" [ngClass]="{'flex-row-reverse': message.sender === 'user'}">
              <div class="flex flex-col justify-end mt-auto mb-1">
                <p-avatar 
                  [icon]="message.sender === 'user' ? 'pi pi-user' : 'pi pi-heart'" 
                  [styleClass]="message.sender === 'user' ? 'bg-primary' : 'bg-teal-500'"
                  shape="circle">
                </p-avatar>
              </div>
              <div 
                class="p-3 rounded-lg shadow-sm" 
                [ngClass]="{
                  'bg-primary text-white rounded-tr-none': message.sender === 'user',
                  'bg-surface-200 dark:bg-surface-700 rounded-tl-none': message.sender !== 'user'
                }">
                <div *ngIf="message.image" class="mb-2">
                  <img [src]="message.image" class="max-h-48 rounded object-contain" />
                </div>
                <p class="m-0 text-base break-words">{{ message.text }}</p>
                <small class="block mt-1 text-xs opacity-70">{{ message.timestamp | date:'short' }}</small>
              </div>
            </div>
          </div>
          
          <!-- Typing indicator -->
          <div *ngIf="isTyping" class="flex mb-3 ml-2">
            <div class="flex gap-2 max-w-[75%]">
              <div class="flex flex-col justify-end mt-auto mb-1">
                <p-avatar 
                  icon="pi pi-heart"
                  styleClass="bg-teal-500"
                  shape="circle">
                </p-avatar>
              </div>
              <div class="p-3 rounded-lg shadow-sm bg-surface-200 dark:bg-surface-700 rounded-tl-none flex items-center">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input area -->
        <div class="p-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
          <!-- Selected image preview -->
          <div *ngIf="selectedImage" class="mb-2 flex items-center">
            <div class="relative inline-block">
              <img [src]="selectedImage" class="h-16 w-16 object-cover rounded" />
              <button 
                pButton 
                icon="pi pi-times" 
                class="p-button-rounded p-button-danger p-button-sm absolute -top-2 -right-2"
                (click)="clearSelectedImage()">
              </button>
            </div>
          </div>
          
          <div class="flex gap-2 items-center">
            <button 
              pButton 
              icon="pi pi-image" 
              class="p-button-rounded p-button-text p-button-sm"
              (click)="fileUpload.click()">
            </button>
            <input 
              type="file" 
              #fileUpload 
              style="display: none" 
              accept="image/*"
              (change)="onFileSelected($event)"
            />
            
            <span class="p-input-icon-right flex-grow relative">
              <i class="pi pi-send cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2" (click)="sendMessage()"></i>
              <input 
                type="text" 
                #messageInput
                pInputText 
                class="w-full p-2 pr-8 rounded-full" 
                placeholder="Type your message..." 
                [(ngModel)]="newMessage"
                (keyup.enter)="sendMessage()"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    
    <p-toast></p-toast>
    <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
    }
    
    .typing-indicator span {
      height: 8px;
      width: 8px;
      margin: 0 2px;
      background-color: #888;
      display: block;
      border-radius: 50%;
      opacity: 0.4;
      animation: typing 1s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) {
      animation-delay: 0s;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0% {
        transform: translateY(0px);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-5px);
        opacity: 0.8;
      }
      100% {
        transform: translateY(0px);
        opacity: 0.4;
      }
    }
    
    .sidebar {
      transition: all 0.3s ease;
    }
    
    .chat-session {
      transition: all 0.2s ease;
    }
    
    .chat-session:hover {
      transform: translateY(-2px);
    }
  `]
})
export class Chatbot implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  // Session management
  chatSessions: ChatSession[] = [];
  currentSessionId: string = '';
  readonly apiBaseUrl = 'http://35.184.60.72:8083/api';
  readonly historyBaseUrl = 'http://35.184.60.72:8080/api';
  readonly userId = 'guest';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  // Get the auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    if (!token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'You are not logged in. Please log in again.'
      });
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit() {
    // Load available chat sessions
    this.loadChatSessions();
  }

  loadChatSessions() {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${this.historyBaseUrl}/chat-history/sessions/${this.userId}`, {
      headers: headers
    }).subscribe({
      next: (data) => {
        this.chatSessions = data.map(session => ({
          sessionId: session[0],
          timestamp: session[1],
          lastMessage: ''
        }));

        // Sort sessions by timestamp (newest first)
        this.chatSessions.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // If there are sessions, load the most recent one
        if (this.chatSessions.length > 0) {
          this.loadSession(this.chatSessions[0].sessionId);
        } else {
          // Create a new session if none exists
          this.createNewSession();
        }
      },
      error: (error) => {
        console.error('Error loading chat sessions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error Loading Sessions',
          detail: 'Failed to load chat sessions. Please try again later.'
        });

        // Create a new session as fallback
        this.createNewSession();
      }
    });
  }

  loadSession(sessionId: string) {
    this.currentSessionId = sessionId;
    this.messages = [];

    // Load chat history for the selected session
    const headers = this.getAuthHeaders();
    this.http.get<ApiChatMessage[]>(`${this.historyBaseUrl}/chat-history/session/${sessionId}`, {
      headers: headers
    }).subscribe({
      next: (data) => {
        this.messages = data.map(msg => ({
          sender: msg.sender === 'user' ? 'user' : 'bot',
          text: msg.message,
          timestamp: new Date(msg.timestamp)
        }));

        // Sort messages by timestamp
        this.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error Loading Chat',
          detail: 'Failed to load chat history. Please try again later.'
        });

        // Add a welcome message as fallback
        if (this.messages.length === 0) {
          this.addBotMessage('Hello! I\'m your health assistant. How can I help you with your appointment today?');
        }
      }
    });
  }

  createNewSession() {
    // Generate a new session ID
    const newSessionId = `session${Math.floor(Math.random() * 10000)}`;

    // Add to local sessions list
    const newSession: ChatSession = {
      sessionId: newSessionId,
      timestamp: new Date().toISOString()
    };

    this.chatSessions.unshift(newSession);
    this.loadSession(newSessionId);

    // Send a welcome message to initialize the session on the server
    const headers = this.getAuthHeaders();
    this.http.post<{ role: string, content: string }>(
      `${this.apiBaseUrl}/chat/message?sessionId=${newSessionId}`,
      { question: 'init_session' },
      { headers: headers }
    ).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.addBotMessage('Hello! I\'m your health assistant. How can I help you  today?');
        }
      },
      error: (error) => {
        console.error('Error creating new session:', error);
        this.addBotMessage('Hello! I\'m your health assistant. How can I help you  today?');
      }
    });
  }

  refreshCurrentSession() {
    if (this.currentSessionId) {
      this.loadSession(this.currentSessionId);
    }
  }

  confirmClearSession() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear this chat session?',
      accept: () => {
        this.messages = [];
        this.addBotMessage('Hello! I\'m your health assistant. How can I help you with your appointment today?');
      }
    });
  }

  sendMessage() {
    if (!this.currentSessionId) {
      this.createNewSession();
      return;
    }

    if ((this.newMessage && this.newMessage.trim()) || this.selectedImage) {
      // Add user message
      this.addUserMessage(this.newMessage, this.selectedImage);

      const userMessage = this.newMessage;
      this.newMessage = '';

      // Show typing indicator
      this.isTyping = true;

      // Call API with text and/or image
      this.callChatApi(userMessage, this.selectedFile)
        .subscribe({
          next: (response) => {
            this.isTyping = false;
            if (response && response.content) {
              this.addBotMessage(response.content);
            } else {
              this.addBotMessage('Sorry, I couldn\'t process your request. Please try again.');
            }
            this.scrollToBottom();

            // Update the session list with the latest message
            this.updateSessionLastMessage(userMessage);
          },
          error: (error) => {
            this.isTyping = false;
            console.error('API Error:', error);
            this.addBotMessage('Sorry, there was an error processing your request. Please try again later.');
            this.scrollToBottom();
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: 'Failed to connect to the chat service.'
            });
          }
        });

      // Clear the selected image after sending
      this.clearSelectedImage();
    }
  }

  updateSessionLastMessage(message: string) {
    const sessionIndex = this.chatSessions.findIndex(s => s.sessionId === this.currentSessionId);
    if (sessionIndex !== -1) {
      // Update the last message and timestamp
      this.chatSessions[sessionIndex].lastMessage = message;
      this.chatSessions[sessionIndex].timestamp = new Date().toISOString();

      // Move the session to the top of the list
      const updatedSession = this.chatSessions.splice(sessionIndex, 1)[0];
      this.chatSessions.unshift(updatedSession);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Reset the input so the same file can be selected again
      input.value = '';
    }
  }

  clearSelectedImage() {
    this.selectedImage = null;
    this.selectedFile = null;
  }

  focusMessageInput() {
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }

  private callChatApi(message: string, image: File | null) {
    const formData = new FormData();
    formData.append('question', message || 'Analyze this image');

    if (image) {
      formData.append('image', image);
    }

    const token = this.getAuthToken();
    let options = {};
    if (token) {
      options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
    }

    return this.http.post<{ role: string, content: string }>(
      `${this.apiBaseUrl}/chat/message?sessionId=${this.currentSessionId}`,
      formData,
      options
    );
  }

  private addUserMessage(text: string, image: string | null = null) {
    this.messages.push({
      sender: 'user',
      text: text || (image ? 'Analyze this image' : ''),
      timestamp: new Date(),
      image: image || undefined
    });

    // Scroll to bottom after adding message
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.messages.push({
      sender: 'bot',
      text: text,
      timestamp: new Date()
    });

    // Scroll to bottom after adding message
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    // If the date is today, just show the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If the date is this year, show the month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    // Otherwise show the full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }
}