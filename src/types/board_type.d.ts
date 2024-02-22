export type BoardItem = {
    game_id : {
        game_id : number;
        game_name : string;
    };
    game_server_id : {
        game_server_id :number;
        game_server_name : string;
    };
    transaction_board_amount: number;
    transaction_board_date: string;
    transaction_board_id: number;
    transaction_board_item_price: number;
    transaction_board_item_type : number;
    transaction_board_min_amount: number;
    transaction_board_sale_type: number;
    transaction_board_title: string;
    user_id: {
      user_id: number;
      user_name: string;
      profile_image: string;
      user_rating : number;
    };
  }