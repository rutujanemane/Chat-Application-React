package com.example;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;

public class ChatWebSocketServlet extends WebSocketServlet {
    @Override
    public void configure(WebSocketServletFactory factory) {
        System.out.println("Configuring WebSocket factory...");
        
        // Set timeout to 10 minutes
        factory.getPolicy().setIdleTimeout(600000);
        
        // Set message size limits
        factory.getPolicy().setMaxTextMessageSize(65536);
        
        // Create WebSocket
        WebSocketCreator creator = (req, resp) -> {
            System.out.println("Creating new WebSocket for request from: " + req.getRemoteAddress());
            return new ChatWebSocket();
        };
        
        factory.setCreator(creator);
        System.out.println("WebSocket factory configured");
    }
}