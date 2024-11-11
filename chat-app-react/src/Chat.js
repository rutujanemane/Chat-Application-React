import React, { useState, useEffect, useCallback, useRef } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = useCallback(() => {
    try {
      if (ws.current) {
        ws.current.close();
      }

      ws.current = new WebSocket('ws://localhost:8080/chat');

      ws.current.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        console.log('Message received:', event.data);
        try {
          const receivedMessage = JSON.parse(event.data);
          if (!receivedMessage.timestamp || new Date(receivedMessage.timestamp).getTime() !== messages[messages.length - 1]?.timestamp.getTime()) {
            setMessages(prevMessages => [...prevMessages, {
              text: receivedMessage.text || receivedMessage,
              timestamp: new Date(),
              sender: 'other'
            }]);
          }
        } catch (e) {
          if (!event.data.includes('Welcome')) {
            setMessages(prevMessages => [...prevMessages, {
              text: event.data,
              timestamp: new Date(),
              sender: 'other'
            }]);
          }
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnected(false);
    }
  }, [messages]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && message.trim()) {
      const messageObj = {
        text: message,
        timestamp: new Date(),
        sender: 'me'
      };

      try {
        ws.current.send(JSON.stringify(messageObj));
        setMessages(prevMessages => [...prevMessages, messageObj]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [message]);

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>WebSocket Test Client</h1>
      
      {/* Connection Status */}
      <div style={{
        marginBottom: '15px',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '5px',
        color: isConnected ? '#2e7d32' : '#c62828',
        backgroundColor: isConnected ? '#e8f5e9' : '#ffebee',
        fontWeight: 'bold'
      }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Messages Container */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        height: '300px',
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f7f7f7',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '10px 15px',
                borderRadius: '15px',
                maxWidth: '70%',
                backgroundColor: msg.sender === 'me' ? '#e3f2fd' : '#f5f5f5',
                color: '#333',
                fontSize: '14px',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '5px', textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1a73e8',
            color: 'white',
            borderRadius: '5px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1557b0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1a73e8'}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
