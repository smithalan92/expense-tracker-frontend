export default function Spinner() {
  const style = {
    "--value": 80,
    "--size": "48px",
    color: "#0284c7",
  } as React.CSSProperties;

  return <div className="radial-progress animate-spin" style={style} />;
}
