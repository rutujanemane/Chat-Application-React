package com.example;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocket extends WebSocketAdapter {
    private static final Set<Session> SESSIONS = ConcurrentHashMap.newKeySet();

    @Override
    public void onWebSocketConnect(Session session) {
        super.onWebSocketConnect(session);
        SESSIONS.add(session);
        System.out.println("Socket Connected: " + session.getRemoteAddress());
        
        try {
            session.getRemote().sendString("Welcome to the chat server!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onWebSocketText(String message) {
        System.out.println("Received message: " + message + " from " + getSession().getRemoteAddress());
        broadcast(message);
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        Session session = getSession();
        SESSIONS.remove(session);
        System.out.println("Socket Closed: [" + statusCode + "] " + reason + " - " + session.getRemoteAddress());
    }

    @Override
    public void onWebSocketError(Throwable cause) {
        Session session = getSession();
        System.err.println("WebSocket Error for " + (session != null ? session.getRemoteAddress() : "unknown client") + ": " + cause.getMessage());
        cause.printStackTrace();
    }

    private void broadcast(String message) {
        System.out.println("Broadcasting message to " + SESSIONS.size() + " sessions");
        SESSIONS.forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.getRemote().sendString(message);
                    System.out.println("Message sent to: " + session.getRemoteAddress());
                }
            } catch (IOException e) {
                System.err.println("Failed to send message to " + session.getRemoteAddress());
                e.printStackTrace();
            }
        });
    }
}