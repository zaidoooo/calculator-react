export type ButtonProps = {
  type: "top" | "operator" | "digits";
  name: string;
  value: string;
  onClick: (value: string) => void;
};

export type Mode = "calculator" | "currency";
