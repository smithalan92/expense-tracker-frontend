import Modal from "../ModalBase/Modal";
import ModalBody from "../ModalBase/ModalBody";
import ModalFooter from "../ModalBase/ModalFooter";

export interface ConfirmModalProps {
  title: React.ReactNode;
  onConfirm: (isConfirmed: boolean) => void;
}

export function ConfirmModal({ title, onConfirm }: ConfirmModalProps) {
  return (
    <Modal position="center">
      <ModalBody height="auto">
        <div className="pt-8">{title}</div>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn btn-secondary font-bold text-md mr-4"
          onClick={() => onConfirm(false)}
        >
          No
        </button>
        <button
          className="btn btn-error font-bold text-md"
          onClick={() => onConfirm(true)}
        >
          Yes
        </button>
      </ModalFooter>
    </Modal>
  );
  return (
    <div className="et-modal-backdrop">
      <div className="animate-fade-in et-modal overflow-hidden box-content z-40">
        <div className="mb-2">{title}</div>
        <div className="flex justify-end items-center pt-6">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={() => onConfirm(false)}
          >
            No
          </button>
          <button
            className="btn btn-error font-bold text-md"
            onClick={() => onConfirm(true)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
