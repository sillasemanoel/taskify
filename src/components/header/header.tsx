// Dependencies
import { FiMenu } from "react-icons/fi";
// Styles
import { HeaderStyle } from "./style";
// Images
import icon from "../../../public/icon.png";

type HeaderProps = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header(props: HeaderProps) {
  return (
    <HeaderStyle>
      <div onClick={() => props.setToggle(!props.toggle)} className="menu">
        <FiMenu />
      </div>
      <div className="logo">
        <img src={icon} alt="Taskify Icon" />
        <h1>Taskify</h1>
      </div>
    </HeaderStyle>
  );
}
