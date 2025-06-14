import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socketService } from '../services/socket';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Messages = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Connect to socket server and fetch initial data
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        console.log('Initializing messages component...');

        // Connect to socket
        await socketService.connect();
        console.log('Socket connected successfully');

        // Fetch matches
        const token = await currentUser.getIdToken();
        const response = await axios.get(`${API_BASE_URL}/api/profiles/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (mounted) {
          console.log('Fetched matches:', response.data);
          setMatches(response.data || []);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        if (mounted) {
          toast.error('Failed to load messages. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      socketService.disconnect();
    };
  }, [currentUser]);

  // Set up message listener
  useEffect(() => {
    if (!selectedMatch) return;

    const handleNewMessage = (message) => {
      console.log('Received new message:', message);
      if (message.sender._id === selectedMatch._id || message.recipient._id === selectedMatch._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      // Update unread count if message is from someone else
      if (message.sender._id !== currentUser.uid) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1
        }));
      }
    };

    const unsubscribe = socketService.onMessage(handleNewMessage);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedMatch, currentUser.uid]);

  // Set up chat when a match is selected
  useEffect(() => {
    if (!selectedMatch) return;

    const setupChat = async () => {
      try {
        // Join the chat room
        await socketService.joinChat(selectedMatch._id);
        
        // Fetch messages
        const token = await currentUser.getIdToken();
        console.log('Fetching messages for chat with:', selectedMatch._id);
        const response = await axios.get(`${API_BASE_URL}/api/messages/${selectedMatch._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Fetched messages:', response.data);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('Invalid messages data:', response.data);
          setMessages([]);
        }
        scrollToBottom();

        // Mark messages as read
        await axios.post(`${API_BASE_URL}/api/messages/${selectedMatch._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Clear unread count for this chat
        setUnreadCounts(prev => ({
          ...prev,
          [selectedMatch._id]: 0
        }));
      } catch (error) {
        console.error('Error setting up chat:', error);
        toast.error('Failed to load messages');
        setMessages([]);
      }
    };

    setupChat();

    return () => {
      if (selectedMatch) {
        socketService.leaveChat(selectedMatch._id).catch(console.error);
      }
    };
  }, [selectedMatch, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || sending) return;

    try {
      setSending(true);
      console.log('Sending message to:', selectedMatch._id);
      const message = await socketService.sendMessage(selectedMatch._id, newMessage.trim());
      console.log('Message sent successfully:', message);
      
      if (message && message._id) {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        setNewMessage('');
        scrollToBottom();
      } else {
        console.error('Invalid message received:', message);
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 2 }}>
      <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
        {/* Matches List */}
        <Paper sx={{ width: 300, overflow: 'auto' }}>
          <List>
            {Array.isArray(matches) && matches.map((match) => (
              <ListItem
                key={match._id}
                button
                selected={selectedMatch?._id === match._id}
                onClick={() => setSelectedMatch(match)}
              >
                <ListItemAvatar>
                  <Avatar src={match.photo} alt={match.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={match.name}
                  secondary={unreadCounts[match._id] ? `${unreadCounts[match._id]} unread` : ''}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">{selectedMatch.name}</Typography>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {Array.isArray(messages) && messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender._id === currentUser.uid ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1,
                        maxWidth: '70%',
                        bgcolor: message.sender._id === currentUser.uid ? 'primary.main' : 'grey.100',
                        color: message.sender._id === currentUser.uid ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography>{message.content}</Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  gap: 1
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending || !selectedMatch}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={sending || !newMessage.trim() || !selectedMatch}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Select a match to start chatting
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Messages; 