import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { chain, evaluate, filter } from "mathjs";

type ButtonProps = {
  type: "top" | "operator" | "digits";
  name: string;
  value: string;
  onClick: (value: string) => void;
};

const operators = ["+", "-", "*", "/"];

function App() {
  const [inputValue, setInputValue] = useState<Record<string, string>>();
  const [displayValue, setDisplayValue] = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

  // function isParenthesesBalanced(expr: string): boolean {
  //   let count = 0;
  //   for (const char of expr) {
  //     if (char === "(") count++;
  //     if (char === ")") count--;
  //     if (count < 0) return false;
  //   }
  //   return count === 0;
  // }

  // handle input changes
  // backspace
  // clear
  // only allow parentheses to be added/removed

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   // Only allow adding/removing parentheses
  //   const charToInsert = value.replace(/[^()]/g, "");

  //   if (inputRef.current) {
  //     const inputElement = inputRef.current;
  //     const cursorPosition = inputElement.selectionStart;
  //     const currentValue = inputElement.value;
  //     if (!cursorPosition) return;
  //     const newValue =
  //       currentValue.substring(0, cursorPosition) +
  //       charToInsert +
  //       currentValue.substring(cursorPosition);

  //     setDisplayValue(newValue);

  //     // Set a timeout to ensure the DOM updates before setting selection range
  //     setTimeout(() => {
  //       inputElement.focus();
  //       inputElement.setSelectionRange(
  //         cursorPosition + charToInsert.length,
  //         cursorPosition + charToInsert.length
  //       );
  //     }, 0);
  //   }
  // };

  const calculate = () => {
    const expression = Object.values(inputValue || {}).join("");
    try {
      const result = evaluate(expression);
      setDisplayValue(result.toString());
      setInputValue({ 0: result.toString() });
    } catch (error) {
      setDisplayValue("Error");
      setInputValue({});
    }
  };

  const isOperatorLastIndex = useCallback(() => {
    if (!inputValue) return { isLastIndex: false, index: 0 };
    const index = Object.keys(inputValue || {}).length;
    const lastIndex = index - 1;
    const isOperator = operators.includes(inputValue[lastIndex]);

    return {
      isLastIndex: isOperator,
      index,
    };
  }, [inputValue]);

  const inputDigits = (value: string) => {
    const { index, isLastIndex } = isOperatorLastIndex();

    if (isLastIndex) {
      setDisplayValue(value);
      setInputValue((prev) => ({ ...prev, [index]: value }));
      return;
    }

    setDisplayValue((prev) => (prev === "0" ? value : prev + value));
    setInputValue((prev) => ({ ...prev, [index]: value }));
  };

  const inputOperator = (value: string) => {
    const { index, isLastIndex } = isOperatorLastIndex();
    if (index === 0) return; // prevent operator input at the beginning
    setInputValue((prev) => {
      if (isLastIndex) {
        return { ...prev, [index - 1]: value };
      }
      return { ...prev, [index]: value };
    });
  };

  const clear = () => {
    setInputValue({});
    setDisplayValue("0");
  };

  const toggleNegate = () => {
    const { index } = isOperatorLastIndex();

    setInputValue((prev) => ({
      ...prev,
      [index]: "*",
      [index + 1]: "-1",
    }));

    setDisplayValue((prev) => String(+prev * -1));
  };

  const percentage = () => {
    setDisplayValue((prev) => String(+prev / 100));
  };

  return (
    <main>
      <div className="calculator-body">
        <input
          className="display"
          type="text"
          value={displayValue}
          readOnly
          // onChange={handleInputChange}
          ref={inputRef}
        />
        <section className="buttons">
          <Button type="top" name="AC" value="all-clear" onClick={clear} />
          <Button type="top" name="+/-" value="*-1" onClick={toggleNegate} />
          <Button type="top" name="%" value="/100" onClick={percentage} />
          <Button type="operator" name="÷" value="/" onClick={inputOperator} />

          <Button type="digits" name="7" value="7" onClick={inputDigits} />
          <Button type="digits" name="8" value="8" onClick={inputDigits} />
          <Button type="digits" name="9" value="9" onClick={inputDigits} />
          <Button type="operator" name="×" value="*" onClick={inputOperator} />

          <Button type="digits" name="4" value="4" onClick={inputDigits} />
          <Button type="digits" name="5" value="5" onClick={inputDigits} />
          <Button type="digits" name="6" value="6" onClick={inputDigits} />
          <Button type="operator" name="-" value="-" onClick={inputOperator} />

          <Button type="digits" name="1" value="1" onClick={inputDigits} />
          <Button type="digits" name="2" value="2" onClick={inputDigits} />
          <Button type="digits" name="3" value="3" onClick={inputDigits} />
          <Button type="operator" name="+" value="+" onClick={inputOperator} />

          <Button type="digits" name="0" value="0" onClick={inputDigits} />
          <Button type="digits" name="." value="." onClick={inputDigits} />
          <Button type="operator" name="=" value="=" onClick={calculate} />
        </section>
      </div>
    </main>
  );
}

export default App;

const Button = ({ type, name, value, onClick }: ButtonProps) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`button ${type} ${name === "0" ? "zero" : ""}`}
    >
      {name}
    </button>
  );
};
