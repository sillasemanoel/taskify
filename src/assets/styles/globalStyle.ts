import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }

  body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  body::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  body::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`
