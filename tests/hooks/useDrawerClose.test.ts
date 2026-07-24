import useDrawerClose from "@/components/ui/drawer/hooks/useDrawerClose";
import { describe, expect, it } from "vitest";
import { computed, nextTick, ref } from "vue";

describe("useDrawerClose", () => {
  it("reports the drawer as open while the source has a value", () => {
    const source = ref<string | null>(null);
    const { isOpen } = useDrawerClose(source);

    expect(isOpen.value).toBe(false);

    source.value = "expense";
    expect(isOpen.value).toBe(true);

    source.value = null;
    expect(isOpen.value).toBe(false);
  });

  it("exposes the source value as content", () => {
    const source = ref<string | null>(null);
    const { content } = useDrawerClose(source);

    source.value = "expense";

    expect(content.value).toBe("expense");
  });

  it("starts with the source value if the drawer is already open", () => {
    const source = ref<string | null>("expense");
    const { isOpen, content } = useDrawerClose(source);

    expect(isOpen.value).toBe(true);
    expect(content.value).toBe("expense");
  });

  it("keeps the content mounted after the source is cleared", () => {
    const source = ref<string | null>("expense");
    const { isOpen, content } = useDrawerClose(source);

    source.value = null;

    // The drawer is closing, but the content must stay so it has something to animate out
    expect(isOpen.value).toBe(false);
    expect(content.value).toBe("expense");
  });

  it("drops the content once the close animation completes", () => {
    const source = ref<string | null>("expense");
    const { content, onOpenComplete } = useDrawerClose(source);

    source.value = null;
    onOpenComplete(false);

    expect(content.value).toBeNull();
  });

  it("keeps the content when the open animation completes", () => {
    const source = ref<string | null>("expense");
    const { content, onOpenComplete } = useDrawerClose(source);

    onOpenComplete(true);

    expect(content.value).toBe("expense");
  });

  it("changes the key on each open so the content remounts", () => {
    const source = ref<string | null>(null);
    const { key, onOpenComplete } = useDrawerClose(source);

    source.value = "first";
    const firstKey = key.value;

    source.value = null;
    onOpenComplete(false);
    source.value = "second";

    expect(key.value).not.toBe(firstKey);
  });

  it("changes the key when reopened before the close animation finishes", () => {
    const source = ref<string | null>("first");
    const { key, content } = useDrawerClose(source);

    const firstKey = key.value;

    // Close and reopen without ever letting onOpenComplete fire
    source.value = null;
    source.value = "second";

    expect(key.value).not.toBe(firstKey);
    expect(content.value).toBe("second");
  });

  it("does not change the key while the drawer stays open", () => {
    const source = ref<string | null>("first");
    const { key, content } = useDrawerClose(source);

    const firstKey = key.value;

    source.value = "second";

    expect(key.value).toBe(firstKey);
    expect(content.value).toBe("second");
  });

  it("sees a close followed immediately by an open when the source is a computed", async () => {
    // Mirrors AddOrEditExpense: the drawer is driven by several store flags combined into one
    // computed. A pre-flush watcher would collapse close + reopen into a single change and
    // never bump the key, leaving the stale instance mounted.
    const isAdding = ref(false);
    const expenseToEdit = ref<string | null>(null);
    const source = computed(() => {
      if (!isAdding.value && !expenseToEdit.value) return null;
      return { expense: expenseToEdit.value };
    });

    const { key, content } = useDrawerClose(source);

    expenseToEdit.value = "expense";
    const firstKey = key.value;
    expect(content.value).toEqual({ expense: "expense" });

    // Close and reopen as "add" within the same tick
    expenseToEdit.value = null;
    isAdding.value = true;
    await nextTick();

    expect(key.value).not.toBe(firstKey);
    expect(content.value).toEqual({ expense: null });
  });
});
