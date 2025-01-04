export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'drawing' | 'gif';
  sender: string;
  timestamp: Date;
  style?: {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    outline?: boolean;
    outlineColor?: string;
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatPartner {
  name: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
}

