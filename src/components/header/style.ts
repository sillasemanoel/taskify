// dependencies
import styled from "styled-components";

export const HeaderStyle = styled.section`
  position: fixed;
  width: 100%;
  height: 64px;
  padding: 8px 11px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  z-index: 1;
  user-select: none;

  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .menu:hover {
    background-color: #f1f1f1;
  }

  @media (max-width: 600px) {
    .menu:hover {
      background-color: transparent;
    }
  }

  .menu svg {
    font-size: 21px;
    color: #202124;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo img {
    width: 40px;
    position: relative;
    margin-left: 5px;
  }

  .logo h1 {
    display: flex;
    font-size: 19px;
    color: #202124;
    margin-left: 5px;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
  }
`;
