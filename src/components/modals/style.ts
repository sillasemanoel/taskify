// dependencies
import styled from "styled-components";

export const ModalStyle = styled.section`
  .modalOverlay {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modalContent {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 500px;
    max-width: 100%;
    position: relative;
  }

  @media (max-width: 630px) {
    .modalContent {
      width: 80%;
    }
  }

  .modalHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .modalHeader h2 {
    font-family: "Poppins", sans-serif;
    user-select: none;
  }

  .closeModal {
    padding: 5px;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    background-color: transparent;
    border: none;
    color: #202124;
    cursor: pointer;
    font-size: 28px;
  }

  .modalContent form div label {
    font-family: "Poppins", sans-serif;
    user-select: none;
  }

  .modalActions {
    width: 100%;
    display: flex;
    gap: 10px;
    justify-content: center;
    user-select: none;
  }

  .modalActions button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid rgb(190, 190, 190);
    border-radius: 6px;
    font-family: "Poppins", sans-serif;
    font-size: 17px;
    font-weight: 500;
    color: #202124;
    background: rgb(255, 255, 255);
    outline: none;
    cursor: pointer;
  }

  .modalActions button:hover {
    padding: 11px;
    background: #6160fa;
    border: 0;
    color: #fff;
  }
`;
