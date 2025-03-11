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

  input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

textarea {
  height: 150px;
  resize: none;
  overflow-y: auto;
}

textarea::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  cursor: pointer;
}
`
