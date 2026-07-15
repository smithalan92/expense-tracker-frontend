<script setup lang="ts">
import type { CountryWithCurrency } from "@/api/app";
import type { CityForCountry } from "@/api/country";
import Button from "@/components/ui/button/Button.vue";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Input from "@/components/ui/input/Input.vue";
import useAppStore from "@/store/appStore";
import { cn } from "@/utils/ui";
import { ChevronRight, XCircle } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import useCityOptions from "./hooks/useCityOptions";
import type { TripModalCountry } from "./hooks/useTripData";

const { isOpen, selectedCountries } = defineProps<{
  isOpen: boolean;
  selectedCountries: TripModalCountry[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: TripModalCountry): void;
}>();

const appStore = useAppStore();

const mode = ref<"selectCountry" | "selectCity">("selectCountry");

const { countries } = storeToRefs(appStore);
const countrySearchTerm = ref("");
const selectedCountryId = ref<Nullable<number>>(null);

const countriesToDisplay = computed(() => {
  if (!countrySearchTerm.value.trim()) return countries.value;
  return countries.value.filter(({ name }) =>
    name.toLowerCase().includes(countrySearchTerm.value.trim().toLowerCase()),
  );
});

const onSelectCountry = (country: CountryWithCurrency) => {
  selectedCountryId.value = country.id;
  mode.value = "selectCity";
};

const { cities, citySearchTerm } = useCityOptions(selectedCountryId);
const selectedCities = ref<Array<{ id: number; name: string }>>([]);

watch(
  () => selectedCountryId.value,
  (newVal) => {
    const existingCities = selectedCountries.find((c) => c.id === newVal)?.cities;

    if (existingCities) {
      selectedCities.value = existingCities;
    }
  },
);

const onSelectCity = (city: CityForCountry) => {
  const existingCityIdx = selectedCities.value.findIndex((c) => c.id === city.id);
  if (existingCityIdx >= 0) {
    selectedCities.value.splice(existingCityIdx, 1);
  } else {
    selectedCities.value.push(city);
  }
};

function resetState() {
  mode.value = "selectCountry";
  countrySearchTerm.value = "";
  citySearchTerm.value = "";
  selectedCountryId.value = null;
  selectedCities.value = [];
}

// Reset state whenever the drawer closes — whether the parent sets :isOpen to
// false or reka-ui internally dismisses it (swipe/escape/outside-press).
watch(() => isOpen, (newVal) => {
  if (!newVal) resetState();
});

const onOpenChange = (open: boolean) => {
  if (!open) resetState();
};

const onClickSave = () => {
  emit("save", {
    name: countries.value.find((c) => c.id === selectedCountryId.value)!.name,
    id: selectedCountryId.value!,
    cities: selectedCities.value,
  });
  emit("close");
};
</script>
<template>
  <Drawer :open="isOpen" @update:open="onOpenChange">
    <DrawerContent :disable-outside-pointer-events="true">
      <div class="mx-auto w-full max-w-sm">
        <DrawerHeader class="flex-row items-center space-between flex-1">
          <DrawerTitle class="flex-1 text-2xl">
            <span v-if="mode === 'selectCountry'">Choose a country</span>
            <span v-else>Choose a city</span>
          </DrawerTitle>
          <Button variant="ghost" @click="emit('close')">
            <XCircle class="size-6" />
          </Button>
        </DrawerHeader>
        <div class="pb-6" v-if="mode === 'selectCountry'">
          <div class="p-4">
            <Input placeholder="Search countries" v-model="countrySearchTerm" :has-clear-button="true" />
          </div>
          <div class="flex flex-col px-4 pb-4 min-w-0 flex-1 h-[300px] overflow-y-scroll">
            <Button
              :class="
                cn(
                  'py-4 my-2 ',
                  selectedCountries.findIndex((c) => c.id === country.id) >= 0
                    ? 'bg-accent hover:!bg-accent/70 !text-white'
                    : '',
                )
              "
              v-for="country in countriesToDisplay"
              :key="country.id"
              variant="ghost"
              @click="onSelectCountry(country)"
            >
              <div class="w-full grid grid-cols-[3.75fr_0.25fr] gap-5 items-stretch">
                <span class="text-left">{{ country.name }}</span>
                <ChevronRight class="size-4 text-muted" />
              </div>
            </Button>
          </div>
        </div>
        <div class="pb-6" v-if="mode === 'selectCity'">
          <div class="p-4">
            <Input placeholder="Search cities" v-model="citySearchTerm" :has-clear-button="true" />
          </div>
          <div class="flex flex-col px-4 pb-4 min-w-0 flex-1 h-[300px] overflow-y-scroll">
            <Button
              :class="
                cn(
                  'py-4 my-2 ',
                  selectedCities.findIndex((c) => c.id === city.id) >= 0
                    ? 'bg-accent hover:!bg-accent/70 !text-white'
                    : '',
                )
              "
              v-for="city in cities"
              :key="city.id"
              variant="ghost"
              @click="onSelectCity(city)"
            >
              <div class="w-full grid grid-cols-[3.75fr_0.25fr] gap-5 items-stretch">
                <span class="text-left">{{ city.name }}</span>
                <ChevronRight class="size-4 text-muted" />
              </div>
            </Button>
          </div>
        </div>
        <DrawerFooter v-if="mode === 'selectCity'" class="flex-1">
          <Button class="w-full text-white" :disabled="!selectedCities.length" @click="onClickSave">
            <span v-if="selectedCities.length">Save {{ selectedCities.length }} cities</span>
            <span v-else>Save</span>
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
