package com.example;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.websocket.server.WebSocketUpgradeFilter;

public class ChatApplication extends Application<ChatConfiguration> {
    public static void main(String[] args) throws Exception {
        new ChatApplication().run(args);
    }

    @Override
    public void initialize(Bootstrap<ChatConfiguration> bootstrap) {
    }

    @Override
    public void run(ChatConfiguration configuration, Environment environment) {
        try {
            System.out.println("WebSocket server starting...");
            
            // Configure WebSocket upgrade filter
            WebSocketUpgradeFilter.configure(environment.getApplicationContext());
            
            // Register WebSocket servlet
            environment.servlets()
                    .addServlet("ws-chat", new ChatWebSocketServlet())
                    .addMapping("/chat/*");
            
            System.out.println("WebSocket server started on ws://localhost:8080/chat");
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to start WebSocket server", e);
        }
    }
}