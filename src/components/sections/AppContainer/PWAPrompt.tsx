import { useRegisterSW } from "virtual:pwa-register/react";

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
      r &&
        setInterval(() => {
          r.update();
        }, 1000 * 60 * 30);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="shadow-lg absolute bottom-5 right-[10%] flex bg-accent p-4 rounded-lg items-center">
      <div className="font-bold text-lg pr-4">An update is available.</div>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => updateServiceWorker(true)}
      >
        Reload
      </button>
    </div>
  );
}
