import React, { ReactNode } from 'react';
import { GiCancel } from "react-icons/gi";
import {
  AiOutlineCheckCircle,
} from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  trxId : string;
}

function short_trx_id(keyString : string) {
  console.log(`keyString : ${keyString}`);
  const maxLength = 10; // 원하는 최대 길이

  if (keyString.length <= maxLength) {
    return keyString;
  }

  const shortenedKey : string = `${keyString.substring(
    0,
    maxLength / 2
  )}...${keyString.substring(keyString.length - maxLength / 2)}`;
  return shortenedKey;
}


const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, trxId }) => {
  if (!isOpen) return null;

  console.log(`trxId`, trxId);

  return (
    <div className="absolute top-1/2 -translate-x-1/2 left-1/2 z-20 rounded-lg bg-white border-2 w-[700px] h-[380px] p-5 shadow-xl">
      <div className="flex flex-col h-full">
        <button className='self-end' onClick={closeModal}><GiCancel size={30}/></button>
        <div className='mt-5 h-full'>
        <div className="w-full h-full font-bold flex flex-col items-center">
          <AiOutlineCheckCircle className="text-lime-500" size={80} />
          <div className="mt-10 text-4xl">구매확정 성공</div>
          <div className="mt-5 text-2xl">구매대금이 판매자에게 전송됩니다.</div>
          <div className="mt-7 text-xl">
            트랜잭션 ID :{" "}
            <a
              className=" text-orange-500 font-bold"
              href={`http://cryptoexplorer.store/Transaction/${trxId}`}
              target="_blank"
            >
              {short_trx_id(trxId)}
            </a>
          </div>
        </div>
        </div>
      </div>
      
    </div>
  );
};

export default Modal;