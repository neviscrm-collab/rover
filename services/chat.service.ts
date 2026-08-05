import type { ChatMessage, Conversation } from "@/lib/types/agency.types";

class ChatServiceClass {
  async getConversations(agencyId: string): Promise<Conversation[]> {
    const { conversations } = (await import("@/mock/messages.json")).default;
    return conversations.filter((c) => c.agencyId === agencyId);
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { messages } = (await import("@/mock/messages.json")).default;
    return (messages as ChatMessage[]).filter(
      (m) => m.conversationId === conversationId
    );
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<ChatMessage> {
    await delay(200);
    return {
      id: `msg_${Math.random().toString(36).slice(2, 8)}`,
      conversationId,
      senderId,
      senderName: "You",
      senderAvatar: "",
      content,
      type: "text",
      readAt: null,
      createdAt: new Date().toISOString(),
    };
  }

  async markAsRead(conversationId: string): Promise<void> {
    await delay(100);
    console.log(`[Mock] Marked conversation ${conversationId} as read`);
  }
}

export const ChatService = new ChatServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
