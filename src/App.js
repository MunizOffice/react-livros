import React from "react";
import Header from "./Components/Header/header";

import './BooksSearch/styles.css';
import RoutesApp from "./Routes";
import { AuthProvider } from "./Authentication/auth";
import GlobalStyle from "./Styles/global";

const App = () => (

  <AuthProvider>
    <Header />
    <RoutesApp />
    <GlobalStyle />
  </AuthProvider>

);

export default App;