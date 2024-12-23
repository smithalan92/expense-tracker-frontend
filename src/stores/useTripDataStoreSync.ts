import { writeTripDataToLocalStorage } from "@/utils/localstorage";
import useTripDataStore from "./tripDataStore";

type StorePropery = keyof ReturnType<typeof useTripDataStore>;

const ACTIONS_TO_SYNC: StorePropery[] = [
  "loadTripData",
  "deleteExpense",
  "addUnsavedExpense",
  "syncUnsavedExpenses",
  "updateUnsavedExpense",
];

function shouldSyncAction(action: StorePropery) {
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
