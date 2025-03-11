// Dependencies
import Masonry from "react-masonry-css";
import { FaUndo, FaRegTrashAlt } from "react-icons/fa";
// Styles
import { GridStyle } from "./style";

type GridProps = {
  toggle: boolean;
  selectedCategory: string;
  filteredNotes: Note[];
  breakpointColumnsObj: {
    default: number;
    [key: number]: number;
  };
  renderDeleteWarning: () => JSX.Element | null;
  handleEditNote: (id: number) => void;
  shouldRenderRestoreButton: (note: Note) => boolean;
  handleRestoreNote: (id: number) => void;
  handleDeletePermanently: (id: number) => void;
};

type Note = {
  id: number;
  title: string;
  message: string;
  status: "note" | "archived";
  condition: "active" | "deleted";
  deletedDate?: string;
};

export default function Grid(props: GridProps) {
  return (
    <GridStyle>
      <div className={props.toggle ? "grid openGrid" : "grid closedGrid"}>
        {props.selectedCategory === "note" &&
          props.filteredNotes.length === 0 && (
            <p className="notice">As notas adicionadas são exibidas aqui.</p>
          )}
        {props.selectedCategory === "archived" &&
          props.filteredNotes.length === 0 && (
            <p className="notice">Suas notas arquivadas são exibidas aqui.</p>
          )}
        {props.selectedCategory === "bin" &&
          props.filteredNotes.length === 0 && (
            <p className="notice">Nenhuma nota na lixeira.</p>
          )}
        {props.renderDeleteWarning()}
        <Masonry
          breakpointCols={props.breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {props.filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => props.handleEditNote(note.id)}
              className="note"
            >
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              {props.shouldRenderRestoreButton(note) && (
                <div>
                  <button onClick={() => props.handleRestoreNote(note.id)}>
                    <FaUndo />
                  </button>
                  <button
                    onClick={() => props.handleDeletePermanently(note.id)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      </div>
    </GridStyle>
  );
}
