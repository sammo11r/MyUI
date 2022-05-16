import React from 'react';
import logo from '../public/logo.svg';
import Image from 'next/image'

function App() {
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

export default App;
