// Dependencies
import { AiOutlineClose } from "react-icons/ai";
// Styles
import { ModalStyle } from "./style";

type EditNoteModalProps = {
  isEditingModalOpen: boolean;
  modalData: Note;
  setModalData: React.Dispatch<React.SetStateAction<Note>>;
  editNoteInputRef: React.RefObject<HTMLInputElement>;
  handleCloseModal: () => void;
  handleSaveEditedNote: () => void;
  handleArchiveNote: () => void;
  handleDeleteNote: () => void;
  shouldRenderArchiveButton: (note: Note) => boolean;
  shouldRenderDeleteButton: (note: Note) => boolean;
};

type Note = {
  id: number;
  title: string;
  message: string;
  status: "note" | "archived";
  condition: "active" | "deleted";
  deletedDate?: string;
};

export default function EditNoteModal(props: EditNoteModalProps) {
  return (
    <ModalStyle>
      {props.isEditingModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h2>Editar</h2>
              <button onClick={props.handleCloseModal} className="closeModal">
                <AiOutlineClose />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Título</label>
                <input
                  type="text"
                  value={props.modalData.title}
                  onChange={(e) =>
                    props.setModalData({
                      ...props.modalData,
                      title: e.target.value,
                    })
                  }
                  ref={props.editNoteInputRef}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={props.modalData.message}
                  onChange={(e) =>
                    props.setModalData({
                      ...props.modalData,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modalActions">
                <button type="button" onClick={props.handleSaveEditedNote}>
                  Salvar
                </button>
                {props.shouldRenderArchiveButton(props.modalData) && (
                  <button type="button" onClick={props.handleArchiveNote}>
                    {props.modalData.status === "note"
                      ? "Arquivar"
                      : "Desarquivar"}
                  </button>
                )}
                {props.shouldRenderDeleteButton(props.modalData) && (
                  <button type="button" onClick={props.handleDeleteNote}>
                    Excluir
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </ModalStyle>
  );
}
