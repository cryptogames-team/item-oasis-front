export type ChatMessage = {
  chat_id: number;
  chat_type: number;
  chat_content: string;
  chat_date: string;
  chat_room: string;
  user_id: {
    user_id: number;
    user_name: string;
    profile_image: string;
    user_rating: number;
  };
};
