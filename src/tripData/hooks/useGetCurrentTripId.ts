import { computed } from "vue";
import { useRoute } from "vue-router";

export default function useGetCurrentTripId() {
  const { params } = useRoute();

  return computed(() => {
    const tripId = parseInt(params["tripId"] as string, 10);

    if (isNaN(tripId)) {
      throw new Error("Invalid tripID param.");
    }

    return tripId;
  });
}
