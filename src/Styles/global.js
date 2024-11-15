import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    width: 100vw;
    height: 100vh;
    background-color: #f0f2f5;
  }
`;

export default GlobalStyle;
