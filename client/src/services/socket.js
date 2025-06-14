import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

class SocketService {
  constructor() {
    this.socket = null;
    this.connectionPromise = null;
  }

  async connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    if (this.connectionPromise) {
      console.log('Connection already in progress');
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('No authenticated user');
        }

        // Get the Firebase ID token
        const token = await user.getIdToken();
        console.log('Got Firebase token for socket connection');

        const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Connecting to socket server at:', serverUrl);

        this.socket = io(serverUrl, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('Socket connected successfully');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.connectionPromise = null;
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          this.connectionPromise = null;
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

      } catch (error) {
        console.error('Error in socket connection:', error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  async ensureConnected() {
    if (!this.socket?.connected) {
      await this.connect();
    }
  }

  async sendMessage(recipientId, content) {
    try {
      await this.ensureConnected();
      return new Promise((resolve, reject) => {
        this.socket.emit('send_message', { recipient: recipientId, content }, (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async joinChat(otherUserId) {
    try {
      await this.ensureConnected();
      this.socket.emit('join_chat', otherUserId);
    } catch (error) {
      console.error('Error joining chat:', error);
      throw error;
    }
  }

  async leaveChat(otherUserId) {
    try {
      await this.ensureConnected();
      this.socket.emit('leave_chat', otherUserId);
    } catch (error) {
      console.error('Error leaving chat:', error);
      throw error;
    }
  }

  onMessage(callback) {
    if (!this.socket) {
      console.warn('Socket not initialized');
      return () => {};
    }
    this.socket.on('new_message', callback);
    return () => {
      this.socket.off('new_message', callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionPromise = null;
    }
  }
}

export const socketService = new SocketService(); 