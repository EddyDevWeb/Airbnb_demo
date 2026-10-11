export interface NotificationType {
    _id: string;
    name: string;
    sendEmail: boolean;
    sendInApp: boolean;
    description: string;
}

export interface Notification {
    _id: string;
    user: string;
    type: NotificationType | string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface Message {
    _id: string;
    from: string;
    to: string;
    listing?: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface Conversation {
    _id: {
        participants: { from: string; to: string };
    };
    lastMessage: Message;
}
