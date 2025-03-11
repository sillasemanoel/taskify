// Dependencies
import { AiOutlineClose } from "react-icons/ai";
// Styles
import { ModalStyle } from "./style";

type AddNoteModalProps = {
  isModalOpen: boolean;
  formData: Note;
  setFormData: React.Dispatch<React.SetStateAction<Note>>;
  newNoteInputRef: React.RefObject<HTMLInputElement>;
  handleSaveNote: () => void;
  handleCloseModal: () => void;
};

type Note = {
  id: number;
  title: string;
  message: string;
  status: "note" | "archived";
  condition: "active" | "deleted";
  deletedDate?: string;
};

export default function AddNoteModal(props: AddNoteModalProps) {
  return (
    <ModalStyle>
      {props.isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h2>Adicionar</h2>
              <button onClick={props.handleCloseModal} className="closeModal">
                <AiOutlineClose />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Título</label>
                <input
                  type="text"
                  value={props.formData.title}
                  onChange={(e) =>
                    props.setFormData({
                      ...props.formData,
                      title: e.target.value,
                    })
                  }
                  ref={props.newNoteInputRef}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={props.formData.message}
                  onChange={(e) =>
                    props.setFormData({
                      ...props.formData,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modalActions">
                <button type="button" onClick={props.handleSaveNote}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModalStyle>
  );
}
