import { Component, OnInit, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebRTCService, WebRTCCallSession } from '../service/webrtc.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [WebRTCService],
  template: `
    <div class="video-container">
      <div class="video-box">
        <video id="local" autoplay muted playsinline></video>
        <div class="label">You</div>
      </div>
      <div class="video-box">
        <video id="remote" autoplay playsinline></video>
        <div class="label">Remote</div>
      </div>
    </div>
    <div class="controls">
      <button (click)="handleCreateCall()" class="call-btn">Create Call</button>
      <button (click)="handleJoinCall()" class="join-btn">Join Call</button>
      <button (click)="handleEndCall()" class="end-btn">End Call</button>
    </div>
    <div *ngIf="callStatus" class="status">
      Call Status: {{callStatus}}
    </div>
  `,
  styles: [`
    .video-container { display: flex; gap: 10px; margin-bottom: 20px; }
    .video-box { position: relative; width: 400px; }
    video { width: 100%; height: auto; border: 1px solid #ccc; background: #f0f0f0; }
    .label { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.5); color: white; padding: 5px; }
    .controls { display: flex; gap: 10px; }
    button { padding: 10px 20px; cursor: pointer; }
    .call-btn { background: #4CAF50; color: white; border: none; }
    .join-btn { background: #2196F3; color: white; border: none; }
    .end-btn { background: #F44336; color: white; border: none; }
    .status { margin-top: 10px; font-weight: bold; }
  `]
})
export class VideoCallComponent implements OnInit, OnDestroy {
  // Services
  private db = inject(AngularFireDatabase);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private webrtcService = inject(WebRTCService);
  
  // Class properties
  private localStream?: MediaStream;
  private remoteStream?: MediaStream;
  private pc?: RTCPeerConnection;
  private roomId = 'test-room';
  private subscriptions: Subscription[] = [];
  private pendingCandidates: RTCIceCandidate[] = [];
  private remoteDescriptionSet = false;
  
  // Database and call tracking
  private callsRef: any;
  private iceCandidatesRef: any;
  private answerRef: any;
  currentCallSession?: WebRTCCallSession;
  callStatus: string = 'Ready';

  constructor() {
    // Initialize Firebase references in constructor
    this.callsRef = this.db.object(`calls/${this.roomId}`);
    this.iceCandidatesRef = this.db.list(`calls/${this.roomId}/iceCandidates`);
    this.answerRef = this.db.object(`calls/${this.roomId}/answer`);
  }

  ngOnInit() {
    this.initializeMedia();
  }

  private async initializeMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      this.zone.run(() => {
        const localVideo = document.getElementById('local') as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = this.localStream!;
        }
        this.initializePeerConnection();
        this.setupSignaling();
        this.cdr.detectChanges();
      });
    } catch (err) {
      console.error('Error accessing media devices:', err);
      this.callStatus = 'Error accessing camera/microphone';
      this.cdr.detectChanges();
    }
  }

  private initializePeerConnection() {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    this.remoteStream = new MediaStream();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.pc!.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming tracks
    this.pc.ontrack = (event) => {
      this.zone.run(() => {
        const remoteVideo = document.getElementById('remote') as HTMLVideoElement;
        if (remoteVideo && event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          remoteVideo.srcObject = this.remoteStream;
          this.callStatus = 'Connected';
          this.cdr.detectChanges();
        }
      });
    };

    // Handle ICE candidates
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.zone.run(() => {
          this.iceCandidatesRef.push(event.candidate!.toJSON());
        });
      }
    };

    // Connection state changes
    this.pc.onconnectionstatechange = () => {
      this.zone.run(() => {
        this.callStatus = `Connection: ${this.pc?.connectionState}`;
        this.cdr.detectChanges();
      });
    };
  }

  private setupSignaling() {
    // Listen for the remote answer
    const answerSub = this.answerRef.valueChanges()
      .subscribe((answer: any) => {
        this.zone.run(() => {
          if (answer && this.pc && this.pc.signalingState !== 'stable') {
            this.pc.setRemoteDescription(new RTCSessionDescription(answer))
              .then(() => {
                console.log("Remote description (answer) set successfully");
                this.remoteDescriptionSet = true;
                this.processPendingCandidates();
              })
              .catch(e => console.error('Error setting remote description:', e));
          }
        });
      });
    
    // Listen for ICE candidates
    const iceSub = this.iceCandidatesRef.valueChanges()
      .subscribe((candidates: any[]) => {
        this.zone.run(() => {
          if (this.pc) {
            candidates.forEach(candidateData => {
              const candidate = new RTCIceCandidate(candidateData);
              if (this.remoteDescriptionSet) {
                this.pc!.addIceCandidate(candidate)
                  .catch(e => console.error('Error adding ICE candidate:', e));
              } else {
                this.pendingCandidates.push(candidate);
              }
            });
          }
        });
      });

    this.subscriptions.push(answerSub, iceSub);
  }

  private processPendingCandidates() {
    if (this.pc && this.remoteDescriptionSet) {
      this.pendingCandidates.forEach(candidate => {
        this.pc!.addIceCandidate(candidate)
          .catch(e => console.error('Error adding pending ICE candidate:', e));
      });
      this.pendingCandidates = [];
    }
  }

  // Public handlers
  handleCreateCall() {
    this.createCall();
  }
  
  handleJoinCall() {
    this.joinCall();
  }

  handleEndCall() {
    this.endCall();
  }

  private async createCall() {
    if (!this.pc) return;
    
    try {
      this.callStatus = 'Creating call...';
      this.cdr.detectChanges();
      
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      
      // Clear any previous call data
      await this.callsRef.set(null);
      await this.iceCandidatesRef.remove();
      await this.callsRef.set({ offer });
      
      // Get user ID - replace with your actual user identification method
      const userId = 'user-' + Math.floor(Math.random() * 1000);
      
      // Save call to backend
      const callData: WebRTCCallSession = {
        firebaseCallId: this.roomId,
        startedBy: userId
      };
      
      this.webrtcService.startCall(callData).subscribe({
        next: (session) => {
          this.currentCallSession = session;
          this.callStatus = 'Call created - Waiting for answer';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error saving call to backend:', error);
          this.callStatus = 'Error saving call';
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      console.error('Error creating call:', error);
      this.callStatus = 'Error creating call';
      this.cdr.detectChanges();
    }
  }

  private async joinCall() {
    if (!this.pc) return;
    
    try {
      this.callStatus = 'Joining call...';
      this.cdr.detectChanges();
      
      const callData: any = await new Promise((resolve) => {
        this.callsRef.valueChanges().pipe(take(1)).subscribe((data: any) => resolve(data));
      });
      
      if (callData?.offer) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(callData.offer));
        this.remoteDescriptionSet = true;
        this.processPendingCandidates();
        
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await this.answerRef.set(answer);
        
        this.callStatus = 'Call joined - Connected';
        this.cdr.detectChanges();
      } else {
        this.callStatus = 'No active call to join';
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error joining call:', error);
      this.callStatus = 'Error joining call';
      this.cdr.detectChanges();
    }
  }

  private async endCall() {
    try {
      this.callStatus = 'Ending call...';
      this.cdr.detectChanges();
      
      // End call in backend if we have a call session
      if (this.currentCallSession?.id) {
        this.webrtcService.endCall(this.currentCallSession.id).subscribe({
          next: () => {
            console.log('Call ended in database');
            this.currentCallSession = undefined;
          },
          error: (error) => console.error('Error ending call in backend:', error)
        });
      }
      
      // Clear Firebase data
      await this.callsRef.set(null);
      
      // Clean up remote video
      const remoteVideo = document.getElementById('remote') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = null;
      }
      
      // Close peer connection
      if (this.pc) {
        this.pc.close();
      }
      
      // Reset WebRTC state
      this.remoteDescriptionSet = false;
      this.pendingCandidates = [];
      
      // Reinitialize for potential future calls
      this.initializePeerConnection();
      this.setupSignaling();
      
      this.callStatus = 'Call ended';
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error ending call:', error);
      this.callStatus = 'Error ending call';
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // End call in backend if necessary
    if (this.currentCallSession?.id) {
      this.webrtcService.endCall(this.currentCallSession.id).subscribe();
    }
    
    // Clean up Firebase data
    this.callsRef.remove();
    
    // Stop all media tracks and close connections
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.pc) {
      this.pc.close();
    }
  }
}