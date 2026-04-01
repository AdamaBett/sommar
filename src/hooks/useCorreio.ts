'use client';

import { useState, useCallback, useEffect } from 'react';
import type { CorreioConversation, CorreioMessage } from '@/types/correio';

interface UseCorreioReturn {
  conversations: CorreioConversation[];
  activeChat: CorreioConversation | null;
  messages: CorreioMessage[];
  remainingCorreios: number;
  openChat: (conversationId: string) => void;
  closeChat: () => void;
  sendMessage: (content: string) => void;
  sendCorreio: (receiverId: string, message?: string) => void;
  timeRemaining: number | null;
}

export function useCorreio(userId: string): UseCorreioReturn {
  const [conversations, setConversations] = useState<CorreioConversation[]>([]);
  const [activeChat, setActiveChat] = useState<CorreioConversation | null>(null);
  const [messages, setMessages] = useState<CorreioMessage[]>([]);
  const [remainingCorreios, setRemainingCorreios] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Timer countdown for active chat
  useEffect(() => {
    if (!activeChat?.expires_at) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(activeChat.expires_at!).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeChat]);

  const openChat = useCallback(
    (conversationId: string) => {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) setActiveChat(conv);
    },
    [conversations]
  );

  const closeChat = useCallback(() => {
    setActiveChat(null);
    setMessages([]);
    setTimeRemaining(null);
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeChat) return;
      const newMsg: CorreioMessage = {
        id: crypto.randomUUID(),
        conversation_id: activeChat.id,
        sender_id: userId,
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      // TODO: persist via Supabase insert + Realtime broadcast
    },
    [activeChat, userId]
  );

  const sendCorreio = useCallback(
    (receiverId: string, message?: string) => {
      if (remainingCorreios <= 0) return;

      const newConv: CorreioConversation = {
        id: crypto.randomUUID(),
        lobby_id: 'mock-lobby',
        sender_id: userId,
        receiver_id: receiverId,
        state: 'active',
        ice_breaker: null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        read_at: null,
        re_enabled_at: null,
        re_enable_method: null,
        created_at: new Date().toISOString(),
      };

      setConversations((prev) => [...prev, newConv]);
      setRemainingCorreios((prev) => prev - 1);

      if (message) {
        const msg: CorreioMessage = {
          id: crypto.randomUUID(),
          conversation_id: newConv.id,
          sender_id: userId,
          content: message,
          created_at: new Date().toISOString(),
        };
        setMessages([msg]);
      }

      setActiveChat(newConv);
      // TODO: persist conversation + first message via Supabase
    },
    [userId, remainingCorreios]
  );

  return {
    conversations,
    activeChat,
    messages,
    remainingCorreios,
    openChat,
    closeChat,
    sendMessage,
    sendCorreio,
    timeRemaining,
  };
}
