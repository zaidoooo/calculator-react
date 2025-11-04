import type { ButtonProps } from "../../types";
import "./Button.css";

export const Button = ({ type, name, value, onClick }: ButtonProps) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`button ${type} ${name === "0" ? "zero" : ""}`}
    >
      {name}
    </button>
  );
};
