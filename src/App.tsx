import { useState } from "react";
import { ModeSelector } from "./components/ModeSelector/ModeSelector";
import { Calculator } from "./components/Calculator/Calculator";
import { CurrencyConverter } from "./components/CurrencyConverter/CurrencyConverter";
import "./App.css";
import type { Mode } from "./types";

function App() {
  const [mode, setMode] = useState<Mode>("calculator");

  return (
    <main>
      <div className="calculator-body">
        <ModeSelector mode={mode} onModeChange={setMode} />
        {mode === "calculator" ? <Calculator /> : <CurrencyConverter />}
      </div>
    </main>
  );
}

export default App;
