// src/services/chat.service.ts
import api from "../api/axios";
import type { Message, Conversation } from "../types/chat.types";

export async function getChatHistory(userId: string): Promise<Message[]> {
    const { data } = await api.get<{ messages: Message[] }>(`/chatAibnb/messages/${userId}`);
    return data.messages || [];
}

export async function getConversations(): Promise<Conversation[]> {
    const { data } = await api.get<{ conversations: Conversation[] }>("/chatAibnb/conversations");
    return data.conversations || [];
}

export async function sendMessage(to: string, content: string, listing?: string): Promise<Message> {
    const { data } = await api.post<{ data: Message }>("/chatAibnb/messages/send", { to, content, listing });
    return data.data;
}
