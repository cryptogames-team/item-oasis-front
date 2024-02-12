
enum ActionType {
    CONNECT_SOCKET = "CONNECT_SOCKET",
    DISCONNECT_SOCKET = "DISCONNECT_SOCKET",
    RECEIVE_MSG = "RECEIVE_MSG",    
    RECEIVE_NOTICE = "RECEIVE_NOTICE",    
    RECEIVE_JOIN_ROOM = "RECEIVE_JOIN_ROOM",        
}

interface Action {
    type : ActionType;
    payload : any;
}


const initialState = {
    socket: null,
    msg : null,
    notice : null,
    is_join : false
};

const socketReducer = (state = initialState, action : Action) => {
    switch (action.type) {
      case ActionType.CONNECT_SOCKET:
        console.log("CONNECT_SOCKET dispatch..", action.payload)
        return { ...state, socket: action.payload };
      
      case ActionType.RECEIVE_MSG :
        console.log("RECEIVE_MSG dispatch.. msg : ", action.payload);
        return { ...state, msg: action.payload };
      
      case ActionType.RECEIVE_NOTICE :
        console.log("RECEIVE_NOTICE dispatch.. msg : ", action.payload);
        return { ...state, notice: action.payload };

      case ActionType.RECEIVE_JOIN_ROOM :
        console.log("RECEIVE_JOIN_ROOM dispatch.. msg : ", action.payload);
        return { ...state, is_join: action.payload };
      
              
      case 'DISCONNECT_SOCKET':
        return { ...state, socket: null };
      default:
        return state;
    }
  };
  
  export default socketReducer;