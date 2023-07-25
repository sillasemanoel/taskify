type AddNoteButtonProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddNoteButton(props: AddNoteButtonProps) {
  return (
    <button onClick={() => props.setIsModalOpen(true)} className='toAdd'>
      +
    </button>
  );
}
