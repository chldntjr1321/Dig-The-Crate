import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
}

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-form rounded-lg px-8 py-5 w-[320px] min-h-[200px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
