const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get chat history with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    console.log('Fetching messages between users:', {
      currentUser: req.user._id,
      otherUser: req.params.userId
    });

    // First, let's check if we have any messages at all
    const totalMessages = await Message.countDocuments();
    console.log('Total messages in database:', totalMessages);

    // Let's see all messages to debug
    const allMessages = await Message.find().populate('sender', 'name photo').populate('recipient', 'name photo');
    console.log('All messages in database:', JSON.stringify(allMessages, null, 2));

    // Convert string IDs to ObjectIds
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    // Log the query we're about to execute
    const query = {
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    };
    console.log('Message query:', JSON.stringify(query, null, 2));

    // Now fetch the messages
    const messages = await Message.find(query)
      .sort({ timestamp: 1 })
      .populate('sender', 'name photo')
      .populate('recipient', 'name photo');

    console.log(`Found ${messages.length} messages between users`);
    if (messages.length > 0) {
      console.log('Sample message:', JSON.stringify(messages[0], null, 2));
    }

    // If no messages found, let's check if the IDs are correct
    if (messages.length === 0) {
      console.log('No messages found. Checking IDs...');
      const senderMessages = await Message.find({ sender: currentUserId });
      const recipientMessages = await Message.find({ recipient: currentUserId });
      console.log('Messages where user is sender:', senderMessages.length);
      console.log('Messages where user is recipient:', recipientMessages.length);
    }

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark messages as read
router.post('/:userId/read', auth, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    const result = await Message.updateMany(
      {
        sender: otherUserId,
        recipient: currentUserId,
        read: false
      },
      { read: true }
    );
    console.log('Marked messages as read:', result);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Get unread message counts for all chats
router.get('/unread/counts', auth, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          recipient: currentUserId,
          read: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Unread counts:', unreadCounts);

    // Convert array to object with sender IDs as keys
    const counts = unreadCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    res.json(counts);
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ error: 'Failed to fetch unread counts' });
  }
});

module.exports = router; 