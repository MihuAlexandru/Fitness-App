import "./Card.css";

export default function Card({ center = true, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`card ${center ? "card--center" : ""} ${className}`.trim()}
    />
  );
}
