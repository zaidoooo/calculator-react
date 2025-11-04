import { useCallback, useMemo, useRef, useState } from "react";
import "./App.css";
import { evaluate } from "mathjs";

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
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

  const calculate = useCallback(() => {
    if (!expression) return;

    try {
      const result = evaluate(expression);
      const resultStr = result.toString();
      setDisplayValue(resultStr);
      setExpression(resultStr);
    } catch {
      setDisplayValue("Error");
      setExpression("");
    }
  }, [expression]);

  const lastChar = useMemo(() => expression.slice(-1), [expression]);
  const isLastCharOperator = useMemo(
    () => operators.includes(lastChar as (typeof operators)[number]),
    [lastChar]
  );

  const inputDigits = useCallback(
    (value: string) => {
      if (isLastCharOperator) {
        setDisplayValue(value);
        setExpression((prev) => prev + value);
        return;
      }

      setDisplayValue((prev) => (prev === "0" ? value : prev + value));
      setExpression((prev) => prev + value);
    },
    [isLastCharOperator]
  );

  const inputOperator = useCallback(
    (value: string) => {
      if (!expression) return;

      if (isLastCharOperator) {
        setExpression((prev) => prev.slice(0, -1) + value);
      } else {
        setExpression((prev) => prev + value);
      }
    },
    [expression, isLastCharOperator]
  );

  const clear = useCallback(() => {
    setExpression("");
    setDisplayValue("0");
  }, []);

  const toggleNegate = useCallback(() => {
    if (!expression) return;

    setExpression((prev) => prev + "*-1");
    setDisplayValue((prev) => String(Number(prev) * -1));
  }, [expression]);

  const percentage = useCallback(() => {
    if (!expression) return;

    setExpression((prev) => prev + "/100");
    setDisplayValue((prev) => String(Number(prev) / 100));
  }, [expression]);

  const handlePeriod = useCallback(
    (value: string) => {
      // Check if current number already has a decimal
      const currentNumberMatch = displayValue.match(/(\d+\.?\d*)$/);
      if (currentNumberMatch?.[0].includes(".")) {
        return;
      }

      if (isLastCharOperator || !expression) {
        setDisplayValue("0.");
        setExpression((prev) => prev + "0.");
        return;
      }

      setDisplayValue((prev) => prev + value);
      setExpression((prev) => prev + value);
    },
    [displayValue, expression, isLastCharOperator]
  );

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
