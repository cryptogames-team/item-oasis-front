"use client";
import {h_postJson} from "@/js/fetch"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { h_get_by_token, h_postJsonText_by_token, h_postJson_by_token } from "@/js/fetch_by_token";
import { useSelector, useDispatch } from "react-redux";
import {RootState} from '@/redux/reducer';

export default function Header() {

  const dispatch = useDispatch();
  const loginState : any = useSelector((state : RootState) => state.loginReducer);
  const is_current_login = loginState.is_current_login;
  

  const [isLogin, setIsLogin] = useState(false);


  const ref_wallet_login_start = useRef<HTMLButtonElement>(null); // 지갑 로그인 팝업창을 띄어줄 버튼. click이 되면 지갑에서 주입한 리스너의 콜백이 발생한다.
  const ref_wallet_login_complete = useRef<HTMLButtonElement>(null);  // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼
  const ref_user_name = useRef<HTMLInputElement>(null);
  const ref_user_key = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    console.log("handleLogin 호출");
    if(ref_wallet_login_start.current !== null && ref_wallet_login_complete.current !== null ) {
      ref_wallet_login_complete.current.addEventListener("click", handleLoginComplete);
      ref_wallet_login_start.current.click();    
    }
  }

  useEffect(() => {
    if(is_current_login === true){
      setIsLogin(true);
    } else if(is_current_login === false) {
      setIsLogin(false);
    }   
  }, [is_current_login]);

  const handleLogout = async () => {
    console.log("handleLogout 호출");

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user/logout`;
      const logoutRes = await h_postJsonText_by_token(url);
      localStorage.setItem("access_token", "");

      console.log(`로그아웃 성공`, logoutRes);    

      dispatch({
        type: "LOG_OUT",
        payload: {
          access_token: null,
          refresh_token: null,
          is_current_login: false,
          user_id: null,
          user_name: null,
        },
      });
      
    } catch (error) {
      console.log(`로그아웃 실패`, error);      
    }
    
  }

  const handleLoginComplete = () => {
    console.log("handleLoginComplete 호출");
    if (ref_user_name.current && ref_user_key.current) {
      const nameValue = ref_user_name.current.value; // 계정 이름
      const keyValue = ref_user_key.current.value; // 공개 키

      const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user`;
      h_postJson(url, {user_name : nameValue})
      .then(res => {
          localStorage.setItem("access_token", res.accessToken);
          localStorage.setItem("refresh_token", res.refreshToken);
          localStorage.setItem("user_name", res.user.user_name);
          localStorage.setItem("user_id", res.user.user_id);
          console.log("로그인 데이터", res.accessToken);

          dispatch({
            type : "LOG_IN",
            payload : {
              access_token: res.accessToken,
              refresh_token : res.refreshToken,
              is_current_login : true,
              user_id : res.user.user_name,
              user_name : res.user.user_name
            }
          });
        }
      );
    }
  }


  useEffect(() => {

    loginLogic();
     
  }, []);

  const loginLogic = async () => {
    console.log("loginLogic 호출");
     // 1. 로컬 스토리지에 있는 access_token을 가져와서 해당 access_token이 유효한지 확인한다.
    // 2. 유효하지 않다면 refresh_token을 통해 access_token을 발급해준다. 만약 refresh_token도 유효하지 않다면 로그아웃 상태로 유지해준다.

    // access_token 또는 refresh_token 이 없다면 당연히 로그아웃 상태
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if(!access_token || !refresh_token){
      return;       
    }

    // access_token이 유효한지 확인. 
    // 유효하면 로그인 처리, 유효하지 않다면 refresh_token을 통해 재발급
    
    try {
      const url_userCheck = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user/check`;
      const loginRes : any = await h_postJson_by_token(url_userCheck);
      console.log(`loginRes`, loginRes);

      dispatch({
        type : "LOG_IN",
        payload : {
          access_token: localStorage.getItem("access_token"),
          refresh_token : localStorage.getItem("refresh_token"),
          is_current_login : true,
          user_id : loginRes.user_id,
          user_name : loginRes.user_name
        }
      });      
      
    } catch (error) {
      console.log(`usercheck 오류`, error);
      handleUserCheckError();
    }
  }

  async function handleUserCheckError() {
    try {
      // refresh 토큰이 유효한지 확인한 후, 유효하다면 access token을 받는다.
      const url_userRefreshCheck = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user/refreshToken`;
      const loginRefreshRes: any = await h_postJson(url_userRefreshCheck, {refToken : localStorage.getItem("refresh_token")});
      localStorage.setItem("access_token", loginRefreshRes.accessToken);
      console.log(`loginRefreshRes`, loginRefreshRes);

      // 유저 정보를 받기 위해 또 api 요청을 보내준다.
      const url_userCheck = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user/check`;
      const loginRes : any = await h_postJson_by_token(url_userCheck);

      dispatch({
        type : "LOG_IN",
        payload : {
          access_token: loginRefreshRes.accessToken,
          refresh_token : localStorage.getItem("refresh_token"),
          is_current_login : true,
          user_id : loginRes.user_id,
          user_name : loginRes.user_name
        }
      });      

    } catch (error) {

      console.log(`refresh token을 통한 access token 갱신 실패`);
      dispatch({
        type: "LOG_OUT",
        payload: {
          access_token: null,
          refresh_token: null,
          is_current_login: false,
          user_id: null,
          user_name: null,
        },
      });
    }
  }

  // useEffect(() => {

  //   // 로그인 처리
  //   console.log(`! is_current_login을 통한 로그인 처리`, is_current_login);
  //   if(is_current_login) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //   }
  
  // }, [is_current_login]);



  return (
    <>
      <button id="login" className="hidden" ref={ref_wallet_login_start}></button>
      <button id="login_complete" className="hidden" ref={ref_wallet_login_complete}></button>
      <input type="hidden" id="UserName" value="undefined" ref={ref_user_name}></input>
      <input type="hidden" id="UserKey" value="undefined" ref={ref_user_key}></input>

      <div className="w-full bg-slate-100 flex flex-col items-center">
        <div className="h-container flex flex-col">
          <div className="w-full flex justify-between py-2 text-sm">
            <Link href="/" className="flex">
              {/* <Image
                src="/아이템오아시스로고.png"
                width={40}
                height={40}
                alt="로고"
              ></Image> */}
              <button className="ml-3 justify-self-start text-xl">
                아이템 오아시스
              </button>
            </Link>
            <div className="flex">
              {
                isLogin ? 
                <>
                  <button onClick={handleLogout}>로그아웃</button>
                </> 
                : 
                <>
                  <button onClick={handleLogin}>로그인</button>
                </>
              }
              
              <button className="ml-2">마이페이지</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}