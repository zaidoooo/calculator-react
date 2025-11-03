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

// Documentation

// The concept here is to store each input (digit or operator) as a value in an object with its index as the key.
// This allows for easy manipulation of the input sequence, such as replacing the last operator if a new one is entered consecutively.
// When calculating the result, we join the values of the object to form a valid mathematical expression.
// Future enhancements could include handling parentheses and more complex expressions.

function App() {
  const [inputValue, setInputValue] = useState<Record<string, string>>();
  const [displayValue, setDisplayValue] = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (index === 0) return; // prevent negate at the beginning

    // important to its evaluation to set it like this
    setInputValue((prev) => ({
      ...prev,
      [index]: "*",
      [index + 1]: "-1",
    }));

    setDisplayValue((prev) => String(+prev * -1));
  };

  const percentage = () => {
    const { index } = isOperatorLastIndex();
    if (index === 0) return; // prevent negate at the beginning

    // important to its evaluation to set it like this
    setInputValue((prev) => ({
      ...prev,
      [index]: "/",
      [index + 1]: "100",
    }));

    setDisplayValue((prev) => String(+prev / 100));
  };

  const handlePeriod = (value: string) => {
    const { index, isLastIndex } = isOperatorLastIndex();

    if (isLastIndex) {
      setDisplayValue("0.");
      setInputValue((prev) => ({ ...prev, [index]: "0." }));
      return;
    }

    // checks if display already has a period in the current number
    const currentNumberMatch = displayValue.match(/(\d+\.?\d*)$/);
    if (currentNumberMatch && currentNumberMatch[0].includes(".")) {
      return;
    }

    setDisplayValue((prev) => prev + value);
    setInputValue((prev) => ({
      ...prev,
      [index]: (prev?.[index] || "") + value,
    }));
  };

  console.log({ inputValue });

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
          <Button type="digits" name="." value="." onClick={handlePeriod} />
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
