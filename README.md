# Real-time Chat Application

A real-time chat application built with React and Java using WebSocket for communication. This application demonstrates bidirectional communication between a React frontend and a Dropwizard-based Java WebSocket server.

## Features

- Real-time messaging
- Message history
- Timestamps for messages

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Native WebSocket API

### Backend
- Java
- Dropwizard framework
- Jetty WebSocket server

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd chat-server
```

2. Build the project:
```bash
mvn clean package
```

3. Run the server:
```bash
java -jar target/chat-server-1.0-SNAPSHOT.jar server src/main/resources/config.yml
```

The WebSocket server will start at `ws://localhost:8080/chat`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React application will start at `http://localhost:3000`

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. The connection status indicator will show if you're connected to the WebSocket server
3. Type your message in the input field and press Enter or click Send
4. Your messages will appear on the right side in blue
5. Received messages will appear on the left side in gray
6. Messages include timestamps

## API Documentation

### WebSocket Endpoints

- `ws://localhost:8080/chat` - Main WebSocket endpoint for chat communication

### Message Format

```json
{
  "text": "message content",
  "timestamp": "2024-11-03T08:00:00.000Z",
  "sender": "me"
}
```