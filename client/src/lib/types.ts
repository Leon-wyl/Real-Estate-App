export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface PostDetail {
  id: string;
  desc: string;
  utilities?: string;
  pet?: string;
  income?: string;
  size?: number;
  school?: number;
  bus?: number;
  restaurant?: number;
  postId: string;
}

export interface Post {
  id: string;
  title: string;
  price: number;
  images: string[];
  img?: string; // For dummy data compatibility
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: "buy" | "rent";
  property: "house" | "apartment" | "condo" | "land";
  createdAt: string;
  userId: string;
  user?: User;
  postDetail?: PostDetail;
  isSaved?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  users: User[];
  receiver: User;
  messages: ChatMessage[];
  lastMessage: string;
  seenBy: string[];
}
