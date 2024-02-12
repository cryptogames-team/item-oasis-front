export type ChatList = {
  transaction_id: number;
  seller: string;
  buyer: string;
  buy_confirmation: number;
  sell_confirmation: number;
  transaction_completed: number;
  is_fraud: number;
  transaction_board_id: number;
  price: string;
  date: string;
  game: {
    game_id: number;
    game_name: string;
  };
  item_count: number;
  chat: {
    chat_id: number;
    chat_type: number;
    chat_content: string;
    chat_date: string;
    chat_room: string;
    is_read: number;
  };
  user: {
    user_id: number;
    user_name: string;
    profile_image: string;
    user_rating: number;
  };
  game_server: {
    game_server_id: number;
    game_server_name: string;
  };
  item_type: number;
  unread_count: number;
};