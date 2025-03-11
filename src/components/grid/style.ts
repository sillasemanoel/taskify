// dependencies
import styled from "styled-components";

export const GridStyle = styled.section`
  .grid {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: start;
    transition: all 0.02s ease-in-out;
    height: calc(100% - 64px);
    box-sizing: border-box;
    padding-top: 74px;
    padding-bottom: 10px;
    padding-right: 20px;
    width: 100%;
    min-height: 100vh;
  }

  .notice {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 14px;
    color: #202124;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
  }

  .deleteWarning {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 14px;
    color: #202124;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
  }

  @media (max-width: 800px) {
    .deleteWarning {
      flex-direction: column;
      user-select: none;
    }
  }

  .deleteWarning p {
    margin: 0;
  }

  .deleteWarning span {
    color: #6160fa;
    cursor: pointer;
  }

  .closedGrid {
    padding-left: 92px;
  }

  .openGrid {
    padding-left: 300px;
  }

  @media (max-width: 600px) {
    .grid {
      padding-left: 20px;
    }
  }

  .my-masonry-grid {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .my-masonry-grid_column {
    background-clip: padding-box;
    width: 255px !important;
  }

  .my-masonry-grid_column > div {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    width: 200px !important;
  }

  .my-masonry-grid p {
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #202124;
    font-weight: 500;
    height: calc(100% - 64px);
  }

  .note h3 {
    display: block;
    text-align: start;
    font-size: 22px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: "Poppins", sans-serif;
  }

  .note p {
    text-align: start;
    font-size: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 15;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    font-family: "Poppins", sans-serif;
  }

  .note div {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .note div button {
    padding: 15px;
    border: none;
    color: #202124;
    cursor: pointer;
    background-color: transparent;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .note div button:focus {
    outline: 0 !important;
  }

  .note div button:hover {
    background-color: #f1f1f1;
  }

  .note div button svg {
    font-size: 18px;
  }
`;
