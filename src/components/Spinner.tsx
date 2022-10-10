export default function Spinner() {
  const style = { "--value": 80, "--size": "48px" } as React.CSSProperties;

  return <div className="radial-progress animate-spin" style={style} />;
}
