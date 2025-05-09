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
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  // Services
  private db = inject(AngularFireDatabase);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private webrtcService = inject(WebRTCService);
  private callTimerInterval?: any;
  callDuration: string = '00:00:00';
  
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
  private connectionStatusRef: any;
  currentCallSession?: WebRTCCallSession;
  callStatus: string = 'Ready';

  // Helper methods for UI
  getStatusClass(): string {
    if (this.isConnected()) return 'connected';
    if (this.callStatus.includes('Error')) return 'error';
    if (this.callStatus.includes('Creating') || 
        this.callStatus.includes('Joining') || 
        this.callStatus.includes('Waiting')) return 'connecting';
    return 'ready';
  }

  isConnected(): boolean {
    return this.callStatus === 'Connected';
  }

  getWaitingMessage(): string {
    if (this.callStatus.includes('Error')) {
      return 'Connection error occurred';
    } else if (this.callStatus.includes('Creating')) {
      return 'Creating new call...';
    } else if (this.callStatus.includes('Joining')) {
      return 'Joining existing call...';
    } else if (this.callStatus.includes('Waiting')) {
      return 'Waiting for healthcare provider...';
    }
    return 'Waiting for connection...';
  }

  constructor() {
    // Initialize Firebase references in constructor
    this.callsRef = this.db.object(`calls/${this.roomId}`);
    this.iceCandidatesRef = this.db.list(`calls/${this.roomId}/iceCandidates`);
    this.answerRef = this.db.object(`calls/${this.roomId}/answer`);
    this.connectionStatusRef = this.db.object(`calls/${this.roomId}/connectionStatus`);
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
      this.callStatus = 'Error: Camera/mic access denied';
      this.cdr.detectChanges();
    }
  }

  private startCallTimer() {
    let seconds = 0;
    this.callTimerInterval = setInterval(() => {
      seconds++;
      const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      this.callDuration = `${hrs}:${mins}:${secs}`;
      this.cdr.detectChanges();
    }, 1000);
  }

  private stopCallTimer() {
    if (this.callTimerInterval) {
      clearInterval(this.callTimerInterval);
      this.callTimerInterval = undefined;
    }
    this.callDuration = '00:00:00';
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
          console.log('Received remote track:', event.track.kind);
          this.remoteStream = event.streams[0];
          remoteVideo.srcObject = this.remoteStream;
          
          // Set status and update shared status in Firebase
          this.callStatus = 'Connected';
          this.connectionStatusRef.set('connected')
            .catch((err: Error) => console.error('Error updating connection status:', err));
            
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
        console.log("Connection state changed:", this.pc?.connectionState);
        
        if (this.pc?.connectionState === 'connected') {
          this.callStatus = 'Connected';
          this.startCallTimer();
          this.connectionStatusRef.set('connected')
            .catch((err: Error) => console.error('Error updating connection status:', err));
        } else if (this.pc?.connectionState === 'disconnected' || 
                  this.pc?.connectionState === 'failed') {
          this.callStatus = 'Error: Connection lost';
          this.stopCallTimer();
          this.connectionStatusRef.set('error')
            .catch((err: Error) => console.error('Error updating connection status:', err));
        } else if (this.pc?.connectionState === 'connecting') {
          this.callStatus = 'Connecting...';
          this.connectionStatusRef.set('connecting')
            .catch((err: Error) => console.error('Error updating connection status:', err));
        }
        
        this.cdr.detectChanges();
      });
    };
    
    // Also monitor ICE connection state
    this.pc.oniceconnectionstatechange = () => {
      this.zone.run(() => {
        console.log("ICE connection state:", this.pc?.iceConnectionState);
        
        if (this.pc?.iceConnectionState === 'connected' || 
            this.pc?.iceConnectionState === 'completed') {
          if (this.callStatus !== 'Connected') {
            this.callStatus = 'Connected';
            this.connectionStatusRef.set('connected')
              .catch((err: Error) => console.error('Error updating connection status:', err));
            this.cdr.detectChanges();
          }
        }
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
                
                // When we receive an answer, signaling is complete but we need to wait for media
                this.callStatus = 'Connecting media...';
                this.cdr.detectChanges();
              })
              .catch(e => {
                console.error('Error setting remote description:', e);
                this.callStatus = 'Error: Connection failed';
                this.cdr.detectChanges();
              });
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
                  .catch((e: Error) => console.error('Error adding ICE candidate:', e));
              } else {
                this.pendingCandidates.push(candidate);
              }
            });
          }
        });
      });
      
    // Add subscription for shared connection status
    const connectionStatusSub = this.connectionStatusRef.valueChanges()
      .subscribe((status: any) => {
        this.zone.run(() => {
          console.log('Connection status from Firebase:', status);
          if (status === 'connected' && this.callStatus !== 'Connected') {
            console.log('Remote side signaled connection is established');
            this.callStatus = 'Connected';
            this.cdr.detectChanges();
          } else if (status === 'error' && !this.callStatus.includes('Error')) {
            this.callStatus = 'Error: Connection issue';
            this.cdr.detectChanges();
          } else if (status === 'ended') {
            // Handle remote call termination
            console.log('Remote side ended the call');
            if (this.callStatus !== 'Call ended' && this.callStatus !== 'Ready') {
              this.handleRemoteCallEnded();
            }
          }
        });
      });

    this.subscriptions.push(answerSub, iceSub, connectionStatusSub);
  }

  // Add this new method to handle when the remote side ends the call
  private handleRemoteCallEnded() {
    console.log('Handling remote call end');
    this.stopCallTimer();
    
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
    setTimeout(() => {
      this.callStatus = 'Ready';
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges();
  }

  private processPendingCandidates() {
    if (this.pc && this.remoteDescriptionSet) {
      this.pendingCandidates.forEach(candidate => {
        this.pc!.addIceCandidate(candidate)
          .catch((e: Error) => console.error('Error adding pending ICE candidate:', e));
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
      await this.connectionStatusRef.set('creating');
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
          this.callStatus = 'Waiting for provider to join...';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error saving call to backend:', error);
          this.callStatus = 'Error: Call setup failed';
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      console.error('Error creating call:', error);
      this.callStatus = 'Error: Call creation failed';
      this.cdr.detectChanges();
    }
  }

  private async joinCall() {
    if (!this.pc) return;
    
    try {
      this.callStatus = 'Joining call...';
      this.connectionStatusRef.set('joining')
        .catch((err: Error) => console.error('Error updating connection status:', err));
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
        
        // Don't set "Connected" yet, wait for actual media connection
        this.callStatus = 'Call joined - Connecting...';
        this.cdr.detectChanges();
      } else {
        this.callStatus = 'Error: No active call found';
        this.connectionStatusRef.set('error')
          .catch((err: Error) => console.error('Error updating connection status:', err));
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error joining call:', error);
      this.callStatus = 'Error: Could not join call';
      this.connectionStatusRef.set('error')
        .catch((err: Error) => console.error('Error updating connection status:', err));
      this.cdr.detectChanges();
    }
  }

  private async endCall() {
    try {
      this.callStatus = 'Ending call...';
      this.stopCallTimer();
      this.cdr.detectChanges();
      
      // Signal to other participants that the call is ending
      await this.connectionStatusRef.set('ended');
      
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
      
      // Wait briefly to ensure the 'ended' status is propagated
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      setTimeout(() => {
        this.callStatus = 'Ready';
        this.cdr.detectChanges();
      }, 3000);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error ending call:', error);
      this.callStatus = 'Error: Could not end call';
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.stopCallTimer();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // End call in backend if necessary
    if (this.currentCallSession?.id) {
      this.webrtcService.endCall(this.currentCallSession.id).subscribe();
    }
    
    // Clean up Firebase data
    this.callsRef.remove();
    this.connectionStatusRef.remove();
    
    // Stop all media tracks and close connections
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.pc) {
      this.pc.close();
    }
  }
}