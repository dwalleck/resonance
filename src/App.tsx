import { invoke } from '@tauri-apps/api/core';
import React, { useState } from 'react';
import './App.css';
import { ResponsiveTest } from './components/ResponsiveTest';
import { TailwindTestResults } from './components/TailwindTestResults';
import { ThemeToggle } from './components/ThemeToggle';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { UIComponentsTest } from './components/UIComponentsTest';

function App(): React.ReactElement {
  // Test comment for pre-commit hook
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet(): Promise<void> {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Resonance!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A modern GUI for RyzenAdj built with Tauri + React
        </p>

        <form
          className="flex justify-center items-center gap-4 mb-6"
          onSubmit={e => {
            e.preventDefault();
            greet();
          }}
        >
          <Input
            id="greet-input"
            onChange={e => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            className="max-w-xs"
          />
          <Button type="submit">Greet</Button>
        </form>
        {greetMsg && <p className="text-lg font-medium mb-8">{greetMsg}</p>}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">UI Components Test</h2>
          <div className="flex justify-center">
            <UIComponentsTest />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Responsive Layout Test</h2>
          <ResponsiveTest />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Tailwind CSS Test Results</h2>
          <TailwindTestResults />
        </div>
      </div>
    </main>
  );
}

export default App;
