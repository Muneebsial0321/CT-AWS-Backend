const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

// Assuming you've already defined your ChatRoom model
const ChatRoom = require('../Schemas/ChatRoom'); // Adjust the path as necessary

// Create a new chat room with the given users and dummy messages
const createChatRoomWithDummyMessages = async (req,res) => {
  const chatRoom = new ChatRoom({
    _id: uuidv4(),  // Unique identifier for the chat room
    users: [
      '48402292-1bd9-48cf-b2c7-04b4d944d097',
      '7e3fceb1-0bd2-4f7f-bf81-3bed717bead6'
    ],
    messages: [
      {
        messageId: uuidv4(), // Unique identifier for the message
        sender: '48402292-1bd9-48cf-b2c7-04b4d944d097',
        message: 'Hello! How are you doing?',
        timestamp: new Date('2024-08-15T10:00:00Z')
      },
      {
        messageId: uuidv4(), // Unique identifier for the message
        sender: '7e3fceb1-0bd2-4f7f-bf81-3bed717bead6',
        message: 'I am good, thanks! What about you?',
        timestamp: new Date('2024-08-15T10:05:00Z')
      },
      {
        messageId: uuidv4(), // Unique identifier for the message
        sender: '48402292-1bd9-48cf-b2c7-04b4d944d097',
        message: 'I am doing well. What are your plans for today?',
        timestamp: new Date('2024-08-15T10:10:00Z')
      },
      {
        messageId: uuidv4(), // Unique identifier for the message
        sender: '7e3fceb1-0bd2-4f7f-bf81-3bed717bead6',
        message: 'Just working on some code. You?',
        timestamp: new Date('2024-08-15T10:15:00Z')
      }
    ]
  });

  try {
    await chatRoom.save();
    console.log('Chat room created with dummy messages:', chatRoom);
    res.json(chatRoom)
  } catch (error) {
    console.error('Error creating chat room:', error);
  }
};

// Run the function to create the chat room
module.exports = createChatRoomWithDummyMessages

