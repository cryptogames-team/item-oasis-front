"use client";

import React, { forwardRef, useImperativeHandle, Ref, useEffect, ReactNode} from "react";
import { TrxReq } from "@/types/heptagon/trx_req_data";
import { useRef } from "react";
import { TrxMultiRef } from "@/types/heptagon/trx_multi_ref";

interface TrxMultiProps {
  onCompleteTrx?: (result_state : string, trx_id : string) => void; // onCompleteTrx 콜백 함수의 자료형 정의
}

// const TrxMulti = forwardRef<TrxMultiRef>((props, ref) => {

function TrxMulti(props: TrxMultiProps, ref: React.Ref<TrxMultiRef>) {
 
 const ref_user_data = useRef<HTMLInputElement>(null); // 유저의 정보가 담길 input 태그
 const ref_trx_data = useRef<HTMLInputElement>(null); // 트랜잭션의 정보가 담길 input 태그
 const ref_wallet_start = useRef<HTMLButtonElement>(null); // 지갑 팝업창을 띄어줄 버튼. click 메서드가 발동되면 지갑에 주입된 리스너의 콜백이 발동된다.

 const ref_status = useRef<HTMLInputElement>(null); // 지갑의 결과 성공 여부가 담길 input 태그
 const ref_result = useRef<HTMLInputElement>(null); // 지갑의 결과 데이터가 담길 input 태그
 const ref_wallet_finish = useRef<HTMLButtonElement>(null); // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼 - click 이벤트에 ref_status와 ref_result의 값을 이용해 후처리를 해주면 된다.


 const handleStartTrx = (trx_req : TrxReq) => {
   console.log("handleStartTrx 호출");
   if (ref_user_data.current && ref_trx_data.current && ref_wallet_start.current) {
        ref_user_data.current.value = trx_req.user_data; // 유저데이터 넣어줌
        ref_trx_data.current.value = JSON.stringify(trx_req.trx_data); // 트랜잭션 데이터 넣기

        ref_wallet_start.current.click(); // 버튼 클릭                          
   }
 }

 const handleCompleteTrx = () => {
   console.log("handleCompleteTrx 호출");

   const result = ref_result.current?.value ?? "없음";
   const status = ref_status.current?.value ?? "FAILED";

   if (status === "FAILED") {
     console.log("FAILE 오류...", result);
     return;
   }

   const stringArray = JSON.parse(result);
   const trx_id = stringArray[0];
   console.log("trx_id : ", trx_id);

   props.onCompleteTrx?.(status, trx_id);
 };

 useImperativeHandle(ref, () => ({
  handleStartTrx
 }));

  return (
    <>
      <input id="auth_name_for_multi" type="hidden" ref={ref_user_data}></input>
      <input id="datas_for_multi" type="hidden" ref={ref_trx_data}/>
      <button id="transactions" className="hidden" ref={ref_wallet_start}></button>

      <input id="result_for_multi" type="hidden" ref={ref_result}></input>
      <input id="status_for_multi" type="hidden" ref={ref_status}></input>
      <button id="transaction_complete_for_multi" className="hidden" ref={ref_wallet_finish} onClick={handleCompleteTrx}></button>
    </>
  );
}

// export default TrxMulti;
export default forwardRef<TrxMultiRef, TrxMultiProps>(TrxMulti);
