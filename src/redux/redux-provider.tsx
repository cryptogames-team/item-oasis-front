"use client"
import React from "react"; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '@/redux/reducer';

const store = createStore(rootReducer);

export function ProviderRedux({
    children,
  }: {
    children: React.ReactNode
  }) {
  console.log("####provider") 
  return (
    <Provider store={store}>{children}</Provider> // Provider 가 store에있는 변수를 받아서 children을 랩핑해 다른곳에서도 사용 할 수 있다.
  );
}