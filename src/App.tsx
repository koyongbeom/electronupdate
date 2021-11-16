import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

declare global {
  interface Window {
    electron: any;
  }
}


function App() {

  const [version, setVersion] = useState("");
  const [active, setActice] = useState(false);
  const [restartActive, setRestartActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.electron.receive("fromMain", (type: string, data: string) => {
      if (type === "version") {
        console.log(type);
        setVersion(data);
      }
      if (type === "update_available"){
        setActice(true);
        setMessage("A new update is available. Downloading now...");
      }
      if (type === "update_downloaded"){
        setMessage('Update Downloaded. It will be installed on restart. Restart now?');
        setActice(true);
        setRestartActive(true);
      }
    })

    window.electron.send("toMain", "update");
  }, [])

  const closeNotification = () => {
    setActice(false);
  }

  const restartApp = () => {
    window.electron.send('toMain','restart_app');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {version}
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


      <div id="notification" className={`hidden ${active ? "active" : ""}`}>
        <p id="message">{message}</p>
        <button onClick={closeNotification} id="close-button" >
          Close
        </button>
        <button id="restart-button" onClick={restartApp} className={`hidden ${restartActive ? "active" : ""}`}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default App;
