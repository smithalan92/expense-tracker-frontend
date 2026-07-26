import { computed, ref, watch, type Ref } from "vue";

/*
  Keeps drawer content mounted until the close animation has finished.

  Drawer content is usually rendered from a nullable source (e.g. the expense being viewed).
  Clearing that source unmounts the content immediately, so the drawer has nothing left to
  animate out. This keeps a copy of the last non-null value around and only drops it once
  the drawer reports its close animation is complete.

  Because the content outlives the close, reopening the drawer mid-animation would otherwise
  reuse the old component instance and show stale data. `key` changes on every open, so bind it
  to the content's :key to force a fresh instance.

  Bind `onOpenComplete` to the Drawer's @update:open-complete handler.
*/
export default function useDrawerClose<T>(source: Ref<T | null | undefined>) {
  const content = ref(source.value ?? null) as Ref<T | null>;
  const key = ref(0);

  const isOpen = computed(() => !!source.value);

  // Sync flush so a close immediately followed by a reopen is still seen as two separate
  // opens - with the default pre flush both changes collapse into one and the key never moves.
  watch(
    source,
    (value, previousValue) => {
      if (!value) return;
      if (!previousValue) key.value++;
      content.value = value;
    },
    { flush: "sync" },
  );

  const onOpenComplete = (open: boolean) => {
    if (!open) content.value = null;
  };

  return {
    isOpen,
    content,
    key,
    onOpenComplete,
  };
}
