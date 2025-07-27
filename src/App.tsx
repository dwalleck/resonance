import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';
import './App.css';

function App(): JSX.Element {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet(): Promise<void> {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className="container">
      <h1>Welcome to Resonance!</h1>
      <p>A modern GUI for RyzenAdj built with Tauri + React</p>

      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={e => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
