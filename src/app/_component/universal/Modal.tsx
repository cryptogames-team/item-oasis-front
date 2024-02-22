import React, { ReactNode } from 'react';
import { GiCancel } from "react-icons/gi";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
}


const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-1/2 -translate-x-1/2 left-1/2 z-20 rounded-lg bg-white border-2 w-[700px] h-[380px] p-5 shadow-xl">
      <div className="flex flex-col h-full">
        <button className='self-end' onClick={closeModal}><GiCancel size={30}/></button>
        <div className='mt-5 h-full'>{children}</div>
      </div>
      
    </div>
  );
};

export default Modal;