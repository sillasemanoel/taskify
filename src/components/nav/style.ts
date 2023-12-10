// dependencies
import styled from "styled-components";

export const NavStyle = styled.section`
  .nav {
    position: fixed;
    bottom: 0;
    padding-top: 8px;
    box-sizing: border-box;
    flex: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: calc(100% - 64px);
    background-color: #ffffff;
    z-index: 3;
    border-right: 1px solid #eaeaea;
    user-select: none;
    transition: all 0.02s ease-in-out;
  }

  .closedNav {
    width: 72px;
  }

  .openNav {
    width: 280px;
    border-right: 0;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  .closedNav button {
    width: 48px;
    height: 48px;
    border-radius: 100%;
    border: 0;
    background-color: #ffffff;
    color: #202124;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .openNav button {
    padding-left: 26px;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    border-radius: 0 25px 25px 0;
    border: 0;
    background-color: #ffffff;
    color: #202124;
    cursor: pointer;
    display: flex;
    justify-content: start;
    align-items: center;
  }

  .nav button:focus {
    outline: 0 !important;
  }

  .nav button.active {
    background-color: #f1f1f1;
  }

  .nav button.active:hover {
    background-color: #f1f1f1;
  }

  .nav button:hover {
    background-color: #f1f1f1;
  }

  .nav button svg {
    font-size: 21px;
  }

  .closedNav button h1 {
    display: none;
  }

  .openNav button h1 {
    margin-left: 33px;
    display: flex;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #202124;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .nav {
      transition: all 0.3s ease-in-out;
    }

    .closedNav {
      left: -100% !important;
      width: 0px !important;
    }

    .openNav {
      left: 0 !important;
      width: 100%;
    }

    .nav button {
      padding-left: 26px;
      box-sizing: border-box;
      width: 100%;
      height: 48px;
      border-radius: 0 25px 25px 0;
      border: 0;
      background-color: #ffffff;
      color: #202124;
      cursor: pointer;
      display: flex;
      justify-content: start;
      align-items: center;
    }

    .nav button:focus {
      outline: 0 !important;
    }

    .nav button.active {
      background-color: #f1f1f1;
    }

    .nav button.active:hover {
      background-color: #f1f1f1;
    }

    .nav button:hover {
      background-color: transparent;
    }

    .nav button svg {
      font-size: 21px;
    }

    .nav button h1 {
      margin-left: 33px;
      display: flex;
      font-family: "Poppins", sans-serif;
      font-size: 14px;
      color: #202124;
      font-weight: 500;
    }
  }
`;
