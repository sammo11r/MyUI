/* eslint-disable require-jsdoc */
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import logo from "../public/logo.svg";

function App() {
  // TODO: Persist user data after succesful signin.
  // eslint-disable-next-line no-unused-vars
  const { data: session, status } = useSession();

  return (
    <div className="App">
      <header className="App-header">
        <Image
          src={logo}
          alt="logo"
          className="App-logo"
          width={500}
          height={500}
        />
        <p>
          Edit <code>pages/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Make sure this page is protected
App.auth = true;

export default App;
