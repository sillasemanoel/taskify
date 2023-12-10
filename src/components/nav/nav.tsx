// Dependencies
import {
  FaRegStickyNote,
  FaRegFolderOpen,
  FaRegTrashAlt,
} from "react-icons/fa";
// Styles
import { NavStyle } from "./style";

type NavProps = {
  toggle: boolean;
  selectedCategory: string;
  handleCategoryChange: (category: "note" | "archived" | "bin") => void;
};

export default function Nav(props: NavProps) {
  return (
    <NavStyle>
      <div className={props.toggle ? "nav openNav" : "nav closedNav"}>
        <button
          onClick={() => props.handleCategoryChange("note")}
          className={props.selectedCategory === "note" ? "active" : ""}
        >
          <FaRegStickyNote />
          <h1>Notas</h1>
        </button>
        <button
          onClick={() => props.handleCategoryChange("archived")}
          className={props.selectedCategory === "archived" ? "active" : ""}
        >
          <FaRegFolderOpen />
          <h1>Arquivo</h1>
        </button>
        <button
          onClick={() => props.handleCategoryChange("bin")}
          className={props.selectedCategory === "bin" ? "active" : ""}
        >
          <FaRegTrashAlt />
          <h1>Lixeira</h1>
        </button>
      </div>
    </NavStyle>
  );
}
