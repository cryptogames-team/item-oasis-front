import io from 'socket.io-client';

export const connectSocket = () => (dispatch) => {
  console.log(`connectSocket 소켓 연결..`);
  const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_2}`);

  dispatch({
    type: 'CONNECT_SOCKET',
    payload: socket,
  });
};

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socket;

  if (socket) {
    socket.disconnect();
  }

  dispatch({
    type: 'DISCONNECT_SOCKET',
  });
};