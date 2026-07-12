export interface IMessageSender {
  id: string;
  name: string;
}

export interface IMessage {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  chatRoomId: string;
  deletedAt: string | null;
  sender: IMessageSender;
}

export interface IMessagesPage {
  messages: IMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IChatRoom {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
