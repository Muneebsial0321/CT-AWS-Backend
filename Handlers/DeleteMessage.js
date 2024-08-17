// Function to delete a message by messageId using the update method
async function deleteMessage(roomId, messageId) {
    // Fetch the chat room by its ID
    let chatRoom = await ChatRoom.get(roomId);
  
    if (chatRoom) {
      // Filter out the message with the specified messageId
      const updatedMessages = chatRoom.messages.filter(
        (msg) => msg.messageId !== messageId
      );
  
      // Update the chat room with the new messages array
      await ChatRoom.update(
        { _id: roomId },
        { $SET: { messages: updatedMessages } }
      );
  
      console.log('Message deleted successfully');
    } else {
      console.log('Chat room does not exist');
      // Optionally, handle the case where the chat room does not exist
      // socket.emit('error', 'Chat room does not exist');
    }
  }
  
  // Usage example
  await deleteMessage('room123', 'msg456');
  