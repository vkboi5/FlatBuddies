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
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
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
    <Container maxWidth="lg" sx={{ height: '100vh', py: 2, bgcolor: '#f5f8fd' }}>
      <Paper 
        elevation={6} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          overflow: 'hidden',
          borderRadius: 4,
          bgcolor: '#fff',
          boxShadow: '0 12px 40px 0 rgba(36,81,166,0.10)'
        }}
      >
        {/* Matches List */}
        <Box sx={{ 
          width: 320, 
          borderRight: '1px solid #e3eafc',
          bgcolor: '#f7fafd',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 0
        }}>
          {/* Search Bar */}
          <Box sx={{ 
            p: 2, 
            bgcolor: '#e3eafc',
            borderBottom: '1px solid #e3eafc',
            boxShadow: '0 2px 8px 0 rgba(36,81,166,0.04)'
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#2451a6' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: '#fff',
                  borderRadius: '999px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover': {
                    bgcolor: '#f7fafd'
                  }
                }
              }}
            />
          </Box>

          {/* Matches List */}
          <List sx={{ 
            flex: 1, 
            overflow: 'auto',
            '& .MuiListItem-root': {
              px: 2,
              py: 1.5
            }
          }}>
            {Array.isArray(matches) && matches.map((match) => (
              <ListItem
                key={match._id}
                button
                selected={selectedMatch?._id === match._id}
                onClick={() => setSelectedMatch(match)}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: '#e3eafc',
                    '&:hover': {
                      bgcolor: '#d1dbf7',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#f7fafd',
                  },
                  borderBottom: '1px solid #e3eafc'
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="success"
                    invisible={!match.online}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#25D366',
                        boxShadow: '0 0 0 2px white'
                      }
                    }}
                  >
                    <Avatar 
                      src={match.profile?.photos?.[0]} 
                      alt={match.name}
                      sx={{ 
                        width: 48, 
                        height: 48,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: '#111b21'
                        }}
                      >
                        {match.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#667781',
                          fontSize: '0.75rem'
                        }}
                      >
                        {match.lastMessageTime ? format(new Date(match.lastMessageTime), 'HH:mm') : ''}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 0.5
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#667781',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '180px'
                        }}
                      >
                        {match.profile?.bio || 'No bio available'}
                      </Typography>
                      {unreadCounts[match._id] > 0 && (
                        <Badge
                          badgeContent={unreadCounts[match._id]}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: '#25D366',
                              color: 'white',
                              minWidth: '20px',
                              height: '20px',
                              borderRadius: '10px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }
                          }}
                        />
                      )}
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f8fd' }}>
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#2451a6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 2,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton 
                    sx={{ color: 'white' }}
                    onClick={() => setSelectedMatch(null)}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar 
                    src={selectedMatch.profile?.photos?.[0]} 
                    alt={selectedMatch.name}
                    sx={{ width: 40, height: 40, border: '2px solid white' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {selectedMatch.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {selectedMatch.online ? (
                        <Chip 
                          label="Online" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#25D366', 
                            color: 'white',
                            height: '20px',
                            '& .MuiChip-label': { px: 1 }
                          }} 
                        />
                      ) : 'Last seen recently'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto', 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                bgcolor: '#f7fafd',
                background: 'none',
              }}>
                {Array.isArray(messages) && messages.map((message, index) => {
                  const isOwnMessage = message.sender._id === currentUser.uid;
                  const showSenderName = !isOwnMessage && (
                    index === 0 || messages[index - 1]?.sender._id !== message.sender._id
                  );
                  return (
                    <Fade in key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                          mb: 0.5,
                        }}
                      >
                        {showSenderName && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#6c63ff',
                              fontWeight: 600,
                              mb: 0.5,
                              ml: 1
                            }}
                          >
                            {message.sender.name}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            bgcolor: isOwnMessage 
                              ? 'linear-gradient(135deg, #2451a6 0%, #6c63ff 100%)' 
                              : '#fff',
                            color: isOwnMessage ? 'white' : '#222',
                            borderRadius: isOwnMessage 
                              ? '22px 22px 8px 22px' 
                              : '22px 22px 22px 8px',
                            p: 2,
                            boxShadow: '0 2px 8px rgba(36,81,166,0.07)',
                            position: 'relative',
                            wordBreak: 'break-word',
                            border: isOwnMessage ? 'none' : '1px solid #e3eafc',
                            transition: 'background 0.2s',
                          }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ fontSize: '1rem', lineHeight: 1.5 }}
                          >
                            {message.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              textAlign: 'right',
                              mt: 1,
                              color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#8a8a8a',
                              fontSize: '0.8rem'
                            }}
                          >
                            {format(new Date(message.timestamp), 'HH:mm')}
                            {isOwnMessage && (
                              <span style={{ marginLeft: '4px', color: '#b2e0ff' }}>
                                ✓{message.read ? '✓' : ''}
                              </span>
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#e3eafc',
                borderTop: '1px solid #e3eafc'
              }}>
                <form onSubmit={handleSendMessage}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    alignItems: 'center',
                    bgcolor: '#fff',
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1,
                    boxShadow: '0 2px 8px 0 rgba(36,81,166,0.06)',
                  }}>
                    <IconButton sx={{ color: '#919191' }}>
                      <EmojiIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#919191' }}>
                      <AttachFileIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: '15px',
                          '& input': {
                            py: 1.5
                          }
                        }
                      }}
                    />
                    <Tooltip title="Send message">
                      <IconButton 
                        type="submit" 
                        color="primary"
                        disabled={!newMessage.trim() || sending}
                        sx={{
                          bgcolor: '#075e54',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#128C7E'
                          },
                          '&.Mui-disabled': {
                            bgcolor: '#e0e0e0',
                            color: '#9e9e9e'
                          }
                        }}
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