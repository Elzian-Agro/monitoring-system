import React from 'react';
import ChatBot from 'react-chatbotify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../slice/dashboardLayoutSlice';

const Chat = () => {
  let hasError = false;
  const currentMode = useSelector(selectTheme);

  // Call the Python backend API to get the chat response
  const callChatbot = async (params) => {
    try {
      const answer = await axios.post(`${process.env.REACT_APP_CHATBOT_URL}`, {
        question: params.userInput.trim(),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if botReply is available and inject it
      if (answer.data) {
        await params.injectMessage(answer.data);
      } else {
        await params.injectMessage('Sorry, no response from the bot.');
        hasError = true;
      }
    } catch (error) {
      await params.injectMessage('Unable to load response from the bot.');
      hasError = true;
    }
  };

  const flow = {
    start: {
      message: 'Hello, How can help you?',
      path: 'loop',
    },
    loop: {
      message: async (params) => {
        await callChatbot(params);
      },
      path: () => {
        if (hasError) {
          return 'start';
        }
        return 'loop';
      },
    },
  };

  const styles = {
    headerStyle: {
      display: 'none',
    },
    chatHistoryButtonStyle: { display: 'none' },
    chatWindowStyle: {
      backgroundColor: currentMode === 'Dark' ? ' #33373e' : '#ffffff',
      width: '100%',
    },
    sendButtonStyle: { backgroundColor: '#3b82f6' },
    userBubbleStyle: { backgroundColor: '#3b82f6' },
    botBubbleStyle: { backgroundColor: '#19b553' },
    chatInputContainerStyle: {
      alignItems: 'end',
      backgroundColor: currentMode === 'Dark' ? ' #33373e' : '#ffffff',
    },
    chatInputAreaStyle: {
      backgroundColor: currentMode === 'Dark' ? ' #33373e' : '#ffffff',
      color: currentMode === 'Dark' ? '#ffffff' : '#000000',
    },
    chatInputAreaFocusedStyle: {
      border: '1px solid blue',
    },
    footerStyle: {
      display: 'none',
    },
  };

  return (
    <div className='mx-5 mt-2'>
      <div className='flex flex-col shadow-lg bg-white dark:bg-secondary-dark-bg rounded-md'>
        <ChatBot
          styles={styles}
          settings={{ general: { embedded: true }, chatHistory: { storageKey: 'example_llm_conversation' } }}
          flow={flow}
        />
      </div>
    </div>
  );
};

export default Chat;
