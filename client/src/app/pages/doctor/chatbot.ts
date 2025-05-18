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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  image?: string; // Base64 encoded image if present
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
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex justify-center w-full h-screen p-0 md:p-4" style="background-image: url('https://img.freepik.com/free-photo/nurse-measuring-patient-blood-pressure_53876-14933.jpg?t=st=1746481571~exp=1746485171~hmac=6887fffbca219bb846598fd0fe0b0f44a9b6bcca8c7bc543e8f12fea2b4c040a&w=1380'); background-size: cover; background-position: center;">
      <div class="bg-surface-0 dark:bg-surface-900 flex flex-col w-4/5 md:w-4/5 lg:w-4/5 max-w-5xl h-[85%] md:h-[85%] rounded-lg shadow-lg overflow-hidden mt-4">
        <!-- Header with responsive padding -->
        <div class="flex justify-between items-center px-3 py-3 md:px-4 md:py-3 bg-primary shadow-md">
          <div class="flex items-center gap-2">
            <i class="pi pi-comments text-white text-xl"></i>
            <h2 class="text-white font-bold text-lg md:text-xl m-0">Health Assistant</h2>
          </div>
          <div class="flex gap-2">
            <button pButton icon="pi pi-refresh" class="p-button-rounded p-button-text p-button-sm p-button-light hidden md:flex"></button>
            <button pButton icon="pi pi-times" class="p-button-rounded p-button-text p-button-sm p-button-light"></button>
          </div>
        </div>
        
        <!-- Chat messages container with improved scrolling -->
        <div class="flex-grow overflow-y-auto p-2 md:p-4" style="max-height: calc(100% - 130px); scroll-behavior: smooth;">
          <div *ngFor="let message of messages" 
               class="mb-3 md:mb-4 flex w-full" 
               [ngClass]="{'justify-end': message.sender === 'user'}">
            <div class="flex gap-2 max-w-[85%] md:max-w-[75%]" [ngClass]="{'flex-row-reverse': message.sender === 'user'}">
              <div class="flex flex-col justify-end mt-auto mb-1">
                <p-avatar 
                  [icon]="message.sender === 'user' ? 'pi pi-user' : 'pi pi-heart'" 
                  [styleClass]="message.sender === 'user' ? 'bg-primary' : 'bg-teal-500'"
                  shape="circle" 
                  size="normal">
                </p-avatar>
              </div>
              <div 
                class="p-2 md:p-3 rounded-lg shadow-sm" 
                [ngClass]="{
                  'bg-primary text-white rounded-tr-none': message.sender === 'user',
                  'bg-surface-200 dark:bg-surface-700 rounded-tl-none': message.sender === 'bot'
                }">
                <div *ngIf="message.image" class="mb-2">
                  <img [src]="message.image" class="max-h-48 rounded object-contain" />
                </div>
                <p class="m-0 text-sm md:text-base break-words">{{ message.text }}</p>
                <small class="block mt-1 text-xs opacity-70">{{ message.timestamp | date:'shortTime' }}</small>
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
                  shape="circle" 
                  size="normal">
                </p-avatar>
              </div>
              <div class="p-2 md:p-3 rounded-lg shadow-sm bg-surface-200 dark:bg-surface-700 rounded-tl-none flex items-center">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input area with improved mobile support -->
        <div class="p-2 md:p-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
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
  `]
})
export class Chatbot implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  readonly API_ENDPOINT = 'http://localhost:8083/api/chat/message?sessionId=test123';
  
  constructor(private http: HttpClient, private messageService: MessageService) {}
  
  ngOnInit() {
    // Initialize with a welcome message
    this.addBotMessage('Hello! Im your health assistant. How can I help you  today?');
  }
  
  sendMessage() {
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
  
  private callChatApi(message: string, image: File | null) {
    const formData = new FormData();
    formData.append('question', message || 'Analyze this image');
    
    if (image) {
      formData.append('image', image);
    }
    
    return this.http.post<{role: string, content: string}>(this.API_ENDPOINT, formData);
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
}