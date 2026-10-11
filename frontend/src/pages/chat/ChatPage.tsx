// src/pages/chat/ChatPage.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getConversations,
    getChatHistory,
    sendMessage as sendChatMessage,
} from "../../services/chat.service";
import type { Message, Conversation } from "../../types/chat.types";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { format } from "date-fns";

export default function ChatPage() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const { userId: chatUserId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = useCallback(async () => {
        try {
            const data = await getConversations();
            setConversations(data);
        } catch {
            toast.error("Error al cargar conversaciones");
        } finally {
            setLoadingConversations(false);
        }
    }, []);

    const seenIdsRef = useRef(new Set<string>());

    const fetchMessages = useCallback(async (targetUserId: string) => {
        setLoadingMessages(true);
        try {
            const data = await getChatHistory(targetUserId);
            seenIdsRef.current = new Set(data.map((m) => m._id));
            setMessages(data);
        } catch {
            toast.error("Error al cargar mensajes");
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (chatUserId) {
            fetchMessages(chatUserId);
        } else {
            setMessages([]);
        }
    }, [chatUserId, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket || !chatUserId) return;
        const handler = (message: Message) => {
            if (message.from !== chatUserId && message.to !== chatUserId) return;
            if (seenIdsRef.current.has(message._id)) return;
            seenIdsRef.current.add(message._id);
            setMessages((prev) => [...prev, message]);
        };
        socket.on("receive-message", handler);
        socket.on("message-sent", handler);
        return () => {
            socket.off("receive-message", handler);
            socket.off("message-sent", handler);
        };
    }, [socket, chatUserId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatUserId) return;
        const content = newMessage.trim();
        setNewMessage("");
        try {
            await sendChatMessage(chatUserId, content);
            if (!conversations.find((c) => {
                const p = c._id.participants;
                return (p.from === chatUserId || p.to === chatUserId);
            })) {
                fetchConversations();
            }
        } catch {
            toast.error("Error al enviar mensaje");
            setNewMessage(content);
        }
    };

    const getOtherUserId = (conv: Conversation): string => {
        const p = conv._id.participants;
        return p.from === user?.user?.id ? p.to : p.from;
    };

    const showSidebar = !chatUserId;
    const showChat = !!chatUserId;

    return (
        <div className="flex h-[calc(100vh-80px)] max-w-6xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">

            {/* Conversations sidebar */}
            <div className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r bg-gray-50 ${showChat ? "md:flex" : ""}`}>
                <div className="p-4 border-b bg-white">
                    <h2 className="text-lg font-semibold">Mensajes</h2>
                </div>
                {loadingConversations ? (
                    <p className="p-4 text-gray-500 text-sm">Cargando...</p>
                ) : conversations.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 text-sm mb-3">No tienes conversaciones aún</p>
                        <Link
                            to="/listings"
                            className="inline-block bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Explorar propiedades
                        </Link>
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const otherId = getOtherUserId(conv);
                        const isActive = otherId === chatUserId;
                        return (
                            <button
                                key={conv._id.participants.from + conv._id.participants.to}
                                onClick={() => navigate(`/chat/${otherId}`)}
                                className={`w-full text-left px-4 py-3 border-b hover:bg-gray-100 transition ${isActive ? "bg-red-50 border-l-4 border-l-red-500" : ""}`}
                            >
                                <p className="text-sm font-medium truncate">
                                    {otherId.slice(0, 8)}...
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                    {conv.lastMessage.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {format(new Date(conv.lastMessage.createdAt), "dd/MM HH:mm")}
                                </p>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Chat area */}
            <div className={`${showChat ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0`}>
                {!chatUserId ? (
                    <div className="flex-1 hidden md:flex items-center justify-center text-gray-400">
                        <p>Selecciona una conversación para chatear</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b bg-white flex items-center gap-3">
                            <button
                                onClick={() => navigate("/chat")}
                                className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <p className="font-semibold text-sm truncate">Chat con {chatUserId.slice(0, 8)}...</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {loadingMessages ? (
                                <p className="text-center text-gray-400">Cargando mensajes...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-gray-400">No hay mensajes aún. ¡Escribe el primero!</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.from === user?.user?.id;
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-2xl text-sm ${
                                                    isMine
                                                        ? "bg-red-500 text-white rounded-br-md"
                                                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                                                }`}
                                            >
                                                <p>{msg.content}</p>
                                                <p className={`text-xs mt-1 ${isMine ? "text-red-200" : "text-gray-400"}`}>
                                                    {format(new Date(msg.createdAt), "HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t bg-white flex gap-2 sm:gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 min-w-0"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 shrink-0"
                            >
                                Enviar
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
