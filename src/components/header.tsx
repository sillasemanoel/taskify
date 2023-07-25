import { FiMenu } from 'react-icons/fi';
import icon from '../../public/icon.png';

type HeaderProps = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header(props: HeaderProps) {
  return (
    <div className='header'>
      <div onClick={() => props.setToggle(!props.toggle)} className='menu'>
        <FiMenu />
      </div>
      <div className='logo'>
        <img src={icon} alt='Taskify Icon' />
        <h1>Taskify</h1>
      </div>
    </div>
  );
}
