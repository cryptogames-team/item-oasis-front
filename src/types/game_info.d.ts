export interface GameName {
  id: number;
  name: string;
}

export interface GameServerName {
  gameInfo: GameName;
  game_server_id: number;
  game_server_name: string;
}
