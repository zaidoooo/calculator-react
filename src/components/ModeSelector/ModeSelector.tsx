import type { Mode } from "../../types";
import "./ModeSelector.css";

type ModeSelectorProps = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="mode-selector">
      <button
        onClick={() => onModeChange("calculator")}
        className={`mode-button ${mode === "calculator" ? "active" : ""}`}
      >
        Calculator
      </button>
      <button
        onClick={() => onModeChange("currency")}
        className={`mode-button ${mode === "currency" ? "active" : ""}`}
      >
        Currency
      </button>
    </div>
  );
};
