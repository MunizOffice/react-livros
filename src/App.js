import React from "react";
import Main from "./BooksSearch/Main";
import './BooksSearch/styles.css';
import RoutesApp from "./Routes";
import { AuthProvider } from "./Authentication/auth";
import GlobalStyle from "./Styles/global";

const App = () => (

  <AuthProvider>
    <RoutesApp />
    <GlobalStyle />
  </AuthProvider>

);

export default App;
