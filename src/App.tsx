import { useState } from "react";
import "./App.css";

type ButtonProps = {
  type: "top" | "operator" | "digits";
  name: string;
};

const rowOne: ButtonProps[] = [
  { name: "AC", type: "top" },
  { name: "+ / -", type: "top" },
  { name: "%", type: "top" },
  { name: "÷", type: "operator" },
];

const rowTwo: ButtonProps[] = [
  { name: "7", type: "digits" },
  { name: "8", type: "digits" },
  { name: "9", type: "digits" },
  { name: "*", type: "operator" },
];

const rowThree: ButtonProps[] = [
  { name: "4", type: "digits" },
  { name: "5", type: "digits" },
  { name: "6", type: "digits" },
  { name: "-", type: "operator" },
];

const rowFour: ButtonProps[] = [
  { name: "1", type: "digits" },
  { name: "2", type: "digits" },
  { name: "3", type: "digits" },
  { name: "+", type: "operator" },
];

const rowFive: ButtonProps[] = [
  { name: "0", type: "digits" },
  { name: ".", type: "digits" },
  { name: "=", type: "operator" },
];

function App() {
  const [displayValue, setDisplayValue] = useState("0");

  const handleDisplayChange = (value: string) => {
    setDisplayValue(value);
  };

  return (
    <main>
      <div className="calculator-body">
        <input className="display" type="text" value={displayValue} />
        <section className="buttons">
          {[rowOne, rowTwo, rowThree, rowFour, rowFive].map((row, rowIndex) => (
            <div key={rowIndex} className="button-row">
              {row.map((button) => (
                <button
                  key={button.name}
                  className={`button ${button.type} ${
                    button.name === "0" ? "zero" : ""
                  }`}
                  onClick={() => handleDisplayChange(button.name)}
                >
                  {button.name}
                </button>
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default App;
