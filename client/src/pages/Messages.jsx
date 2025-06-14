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
  InputAdornment,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socketService } from '../services/socket';
import axios from 'axios';
import { format } from 'date-fns';

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
    <Container maxWidth="lg" sx={{ height: '100vh', py: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          overflow: 'hidden',
          borderRadius: 2,
          bgcolor: '#f5f5f5'
        }}
      >
        {/* Matches List */}
        <Box sx={{ 
          width: 320, 
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search Bar */}
          <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>

          {/* Matches List */}
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {Array.isArray(matches) && matches.map((match) => (
              <ListItem
                key={match._id}
                button
                selected={selectedMatch?._id === match._id}
                onClick={() => setSelectedMatch(match)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#e3f2fd',
                    '&:hover': {
                      bgcolor: '#bbdefb',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="success"
                    invisible={!match.online}
                  >
                    <Avatar 
                      src={match.profile?.photos?.[0]} 
                      alt={match.name}
                      sx={{ width: 48, height: 48 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {match.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {match.profile?.bio || 'No bio available'}
                    </Typography>
                  }
                />
                {unreadCounts[match._id] > 0 && (
                  <Badge
                    badgeContent={unreadCounts[match._id]}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5' }}>
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'white',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={selectedMatch.profile?.photos?.[0]} 
                    alt={selectedMatch.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {selectedMatch.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMatch.online ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {Array.isArray(messages) && messages.map((message, index) => (
                  <Fade in key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender._id === currentUser.uid ? 'flex-end' : 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: message.sender._id === currentUser.uid ? '#dcf8c6' : 'white',
                          borderRadius: 2,
                          p: 1.5,
                          boxShadow: 1,
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            textAlign: 'right',
                            mt: 0.5
                          }}
                        >
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0'
              }}>
                <form onSubmit={handleSendMessage}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton>
                      <EmojiIcon />
                    </IconButton>
                    <IconButton>
                      <AttachFileIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#f0f2f5',
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Tooltip title="Send message">
                      <IconButton 
                        type="submit" 
                        color="primary"
                        disabled={!newMessage.trim() || sending}
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </form>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f0f2f5'
            }}>
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Messages; 