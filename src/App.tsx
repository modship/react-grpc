import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MyService } from './MyService';

import { Args, bytesToStr, IClient, ClientFactory, strToBytes } from "@massalabs/massa-web3";

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
  const service = new MyService('http://192.168.1.183:33037');
  let observable = service.newSlots();
  observable.subscribe((outputs) => {
    //console.log(outputs.output?.executionOutput?.slot?.period, outputs.output?.executionOutput?.slot?.thread);
    //console.log(outputs);
    if (outputs.output?.executionOutput?.events?.[0]?.data) {
      const events = outputs.output?.executionOutput?.events;
      if (events !== undefined) {
        for (let event of events) {
          let d = bytesToStr(event.data);
          let status = outputs.output.status == 1 ? "candidate" : "final";
          console.log(status + ' : ' + d);
        }
      }
    }
  });
}


export default App;
