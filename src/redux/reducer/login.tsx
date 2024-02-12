
enum ActionType {
    LOG_IN = "LOG_IN",
    LOG_OUT = "LOG_OUT",
}

interface Action {
    type : ActionType;
    payload : any;
}


const initialState = {
    access_token: null,
    refresh_token : null,
    is_current_login : false,
    user_id : null,
    user_name : null
};

const loginReducer = (state = initialState, action : Action) => {
    switch (action.type) {
      case ActionType.LOG_IN:
        console.log("LOG_IN dispatch..", action.payload)
        return { ...state, socket: action.payload };
      
      case ActionType.LOG_OUT :
        console.log("LOG_OUT dispatch.. msg : ", action.payload);
        return { ...state, msg: action.payload };
      
      default:
        return state;
    }
  };
  
  export default loginReducer;