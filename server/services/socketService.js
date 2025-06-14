const socketIO = require('socket.io');
const admin = require('firebase-admin');
const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require('mongoose');

class SocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // userId -> socket
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        console.log('Socket auth attempt with token:', token ? 'Token present' : 'No token');

        if (!token) {
          console.log('No token provided');
          return next(new Error('Authentication error'));
        }

        // Remove 'Bearer ' prefix if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        console.log('Token string:', tokenString);

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(tokenString);
        console.log('Decoded Firebase token:', decodedToken);

        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
          console.log('User not found for Firebase UID:', decodedToken.uid);
          return next(new Error('User not found'));
        }

        socket.user = user;
        console.log('Socket authenticated for user:', user._id);
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);
      console.log('Connected user:', socket.user._id);

      // Store socket reference
      this.userSockets.set(socket.user._id.toString(), socket);

      // Handle joining a chat
      socket.on('join_chat', (otherUserId) => {
        console.log('Joining chat:', {
          userId: socket.user._id,
          otherUserId: otherUserId
        });
        const roomId = this.getRoomId(socket.user._id, otherUserId);
        socket.join(roomId);
        console.log('Joined room:', roomId);
      });

      // Handle leaving a chat
      socket.on('leave_chat', (otherUserId) => {
        const roomId = this.getRoomId(socket.user._id, otherUserId);
        socket.leave(roomId);
        console.log('Left room:', roomId);
      });

      // Handle new message
      socket.on('send_message', async (data, callback) => {
        try {
          console.log('Received message:', {
            from: socket.user._id,
            to: data.recipient,
            content: data.content
          });

          // Convert IDs to ObjectIds
          const senderId = new mongoose.Types.ObjectId(socket.user._id);
          const recipientId = new mongoose.Types.ObjectId(data.recipient);

          // Create and save message
          const message = new Message({
            sender: senderId,
            recipient: recipientId,
            content: data.content,
            timestamp: new Date()
          });

          console.log('Saving message:', message);
          await message.save();
          console.log('Message saved successfully');

          // Populate sender and recipient details
          const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name photo')
            .populate('recipient', 'name photo');

          console.log('Populated message:', populatedMessage);

          // Emit to recipient if online
          const recipientSocket = this.userSockets.get(data.recipient);
          if (recipientSocket) {
            console.log('Recipient is online, emitting message');
            recipientSocket.emit('new_message', populatedMessage);
          }

          // Send acknowledgment to sender
          if (callback) {
            console.log('Sending acknowledgment to sender');
            callback(populatedMessage);
          }
        } catch (error) {
          console.error('Error handling message:', error);
          if (callback) {
            callback({ error: 'Failed to send message' });
          }
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        this.userSockets.delete(socket.user._id.toString());
      });
    });
  }

  getRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  }
}

module.exports = new SocketService(); 