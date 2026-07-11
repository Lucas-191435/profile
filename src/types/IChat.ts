export interface IMessageSender {
  id: string;
  name: string;
}

export interface IMessage {
  id: string | number;
  createdAt: string;
  sender: IMessageSender;
  text: string;
}

export interface IMessagesPage {
  messages: IMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface TeamSlot {
  pokemonId: string | null;
}

export interface Team {
  slots: TeamSlot[];
}

export interface IChat {
  id: string;
  name: string;
}
