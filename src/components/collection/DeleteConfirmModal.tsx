import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface DeleteConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmModal = ({ onConfirm, onCancel }: DeleteConfirmModalProps) => {
  return (
    <Modal onClose={onCancel}>
      {/* 휴지통 + 문구 묶음 — 모달 세로 가운데 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="text-accent"
          aria-hidden="true"
        >
          <path
            d="M3 6H21M8 6V4H16V6M19 6L18 20H6L5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 11V17M14 11V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <p className="text-primary text-[15px] font-medium">삭제하시겠어요?</p>
      </div>

      <div className="flex gap-3 w-full mt-7">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          취소
        </Button>
        <Button variant="primary" className="flex-1" onClick={onConfirm}>
          삭제
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
