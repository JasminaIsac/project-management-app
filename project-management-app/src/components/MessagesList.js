import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getMessagesByTaskId, sendMessage } from '../../api';

const MessagesList = ({ taskId, currentUser_id }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef(null); // Referință pentru ScrollView

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const taskMessages = await getMessagesByTaskId(taskId);
        setMessages(taskMessages);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [taskId]);


  const scrollToBottom = () => {
    // Derulează ScrollView la sfârșit
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      //Alert.alert('Error', 'Message cannot be empty.');
      return;
    }

    try {
      const messageData = {
        task_id: taskId,
        sender_id: currentUser_id,
        message: newMessage,
      };

      const response = await sendMessage(messageData);

      if (response.success) {
        const newMessageData = response.newMessage;
        const lastMessage = messages[messages.length - 1];
        const lastMessageDate = lastMessage ? new Date(lastMessage.created_at).toDateString() : null;
        const newMessageDate = new Date(newMessageData.created_at).toDateString();

        // Adaugă separatorul dacă e prima dată din ziua respectivă
        if (lastMessageDate !== newMessageDate) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { isDateSeparator: true, date: newMessageDate },
            newMessageData,
          ]);
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageData]);
        }
        setNewMessage('');
        scrollToBottom();
      } else {
        Alert.alert('Error', 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={messages.length === 0 && styles.emptyMessagesContainer}
      onContentSizeChange={scrollToBottom}>
        {(() => {
          let lastDate = null;
          if(messages.length===0){
            return (
            <View style={styles.emptyMessages}>
              <Text style={styles.noMessages}>No previous messages for this task.</Text>
            </View>
            )
          }
          return messages.map((message, index) => {
            if (message.isDateSeparator) {
              return (
                <Text key={`date-${index}`} style={styles.dateSeparator}>
                  {message.date}
                </Text>
              );
            }

            const messageDate = new Date(message.created_at).toDateString();
            const showDateSeparator = lastDate !== messageDate;
            lastDate = messageDate;

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <Text style={styles.dateSeparator}>
                    {new Date(message.created_at).toLocaleDateString()}
                  </Text>
                )}
                <View
                  style={[
                    styles.messageContainer,
                    message.sender_id === currentUser_id ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <Text style={styles.sender}>
                    {message.sender_id === currentUser_id ? 'You' : message.sender_name}
                  </Text>
                  <Text style={styles.messageText}>{message.message}</Text>
                  <Text style={styles.status}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </React.Fragment>
            );
          });
        })()}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 350,
    paddingTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    marginBottom: 20,
  },
  messageContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#c4eeff',
    alignContent: 'flex-end',
    textAlign: 'left',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  dateSeparator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyMessages: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Asigură-te că umple spațiul disponibil
  },
  noMessages:{
    fontSize: 13,
    fontWeight: 400,
    color: '#8e8e8e',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});

export default MessagesList;
