// Styles
import { AddNoteButtonStyle } from "./style";

type AddNoteButtonProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddNoteButton(props: AddNoteButtonProps) {
  return (
    <AddNoteButtonStyle onClick={() => props.setIsModalOpen(true)}>
      +
    </AddNoteButtonStyle>
  );
}
