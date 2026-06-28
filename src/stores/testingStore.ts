import { acceptHMRUpdate, defineStore } from "pinia";

const getCriteriaItems = (): TestingCategory[] => {
  return [
    {
      category: "Login/Auth",
      criteria: [
        { item: "User can login", done: false },
        { item: "User can logout", done: false },
        { item: "User stays logged in", done: false },
      ],
    },
    {
      category: "Trip Page",
      criteria: [
        { item: "A list of trips displays", done: false },
        { item: "Clicking the add trip button opens the add trip modal", done: false },
        { item: "A trip can be clicked on to view it", done: false },
      ],
    },
    {
      category: "Add Trip modal",
      criteria: [
        { item: "The imager picker works", done: false },
        { item: "The date pickers work", done: false },
        { item: "The country picker/city pickers work", done: false },
        { item: "The user picker works", done: false },
        { item: "The correct data is saved", done: false },
        { item: "One added the trip appears in the trip list", done: false },
      ],
    },
    {
      category: "Edit Trip modal",
      criteria: [
        { item: "The correct trip data is displayed", done: false },
        { item: "The trip can be edited and is saved correctly", done: false },
        { item: "One edited, the updated data appears in the trip", done: false },
      ],
    },
    {
      category: "Trip Data",
      criteria: [
        { item: "The trip can be edited", done: false },
        { item: "The trip can be deleted", done: false },
        { item: "A list of expenses is displayed", done: false },
        { item: "Clicking an expense opens the view modal", done: false },
        { item: "Clicking the add expense button opens the add expense modal", done: false },
        { item: "The list can be refreshed", done: false },
      ],
    },
    {
      category: "View Expense Modal",
      criteria: [
        { item: "The expense can be edited", done: false },
        { item: "The expense can be deleted", done: false },
        { item: "The expense can be copied", done: false },
      ],
    },
    {
      category: "Add expense modal",
      criteria: [
        { item: "The date picker works", done: false },
        { item: "The time picker works", done: false },
        { item: "The correct countriy options are shown", done: false },
        { item: "The correct city options for the selected country are shown", done: false },
        {
          item: "The default currency for that country is selected when you choose a country",
          done: false,
        },
        { item: "The correct list of currencies is shown based on the countries available", done: false },
        { item: "The correct list of categories is shown", done: false },
        { item: "The correct list of users is shown", done: false },
        { item: "The correct data is saved and displayed in the trip data view", done: false },
      ],
    },
    {
      category: "Edit expense modal",
      criteria: [
        { item: "The correct expense data is displayed", done: false },
        { item: "The correct data is updated and displayed in the trip data view", done: false },
      ],
    },
    {
      category: "Copy expense modal",
      criteria: [
        { item: "The correct expense data is displayed", done: false },
        { item: "The expense is successfully copied", done: false },
      ],
    },
    {
      category: "Offline functionality",
      criteria: [
        { item: "An offline notice is shown", done: false },
        { item: "The trip list is cached and displays the cached trips", done: false },
        { item: "The add trip save button is disabled when offline", done: false },
        {
          item: "The trip data is cached when a trip has been loaded and can be visited when offline",
          done: false,
        },
        { item: "The edit trip save button is disabled when offline", done: false },
        { item: "Trying to edit or delete an expense is disabled when offline", done: false },
        { item: "An expense can be added when offline and shows as pending", done: false },
        {
          item: "Adding an expense when offline, going online and refreshing the list shows the pending expense",
          done: false,
        },
        { item: "The pending expense can be synced when online", done: false },
      ],
    },
  ];
};

const useTestingStore = defineStore("testing", {
  state: (): TestingState => ({
    items: getCriteriaItems(),
  }),
  getters: {
    getCriteria: (state) => state.items,
  },
  actions: {
    reset() {
      this.items = getCriteriaItems();
    },
  },

  persist: true,
});

export default useTestingStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTestingStore, import.meta.hot));
}

interface TestingState {
  items: TestingCategory[];
}

interface TestingCategory {
  category: string;
  criteria: TestingCriteria[];
}

interface TestingCriteria {
  item: string;
  done: boolean;
}
