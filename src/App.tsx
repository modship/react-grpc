import React from 'react';
import logo from './logo.svg';
import './App.css';
import { bytesToStr } from "@massalabs/massa-web3";
import { MyService } from './MyService';

const GRPC_URL = "http://192.168.1.183:33037";
const EMITTER_ADDRESS = "AS12gWWfmXgT7HSZ8kc6syJbQA5EnDreggGRjwjSfYnR8jeL3tYU4";

let is_init = false;

function App() {
  init();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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

async function init() {
  if (is_init) {
    return;
  }
  is_init = true;
  const service = new MyService(GRPC_URL);
  let observable = service.newSlots(EMITTER_ADDRESS);
  observable.subscribe((outputs) => {
    if (outputs.output?.executionOutput?.events?.[0]?.data) {
      const events = outputs.output?.executionOutput?.events;
      if (events !== undefined) {
        for (let event of events) {
          if (event.data) {
            let d = bytesToStr(event.data);
            let status = outputs.output.status == 1 ? "candidate" : "final";
            console.log(d + " - " + status);
          }
        }
      }
    }
  });
}


export default App;
