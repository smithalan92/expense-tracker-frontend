import Spinner from "./Spinner";

export default function SpinnerOverlay() {
  return (
    <div className="et-modal-backdrop overflow-hidden">
      <Spinner />
    </div>
  );
}
