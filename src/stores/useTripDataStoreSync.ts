import { writeTripDataToLocalStorage } from "@/utils/localstorage";
import useTripDataStore from "./tripDataStore";

const ACTIONS_TO_SYNC = ["loadTrip", "deleteExpense"];

function shouldSyncAction(action: string) {
  return ACTIONS_TO_SYNC.includes(action);
}

export default function useTripDataStoreSync() {
  const store = useTripDataStore();

  store.$onAction(({ name, store, after }) => {
    if (shouldSyncAction(name)) {
      after(() => {
        writeTripDataToLocalStorage(store.$state);
      });
    }
  });
}
