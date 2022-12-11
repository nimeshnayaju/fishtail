export function createStore() {
  const subscribers = new Set<(state: ReturnType<typeof getState>) => void>();

  chrome.storage.local.onChanged.addListener(() => {
    const state = getState();
    subscribers.forEach((subscriber) =>
      subscriber(state.then((state) => state))
    );
  });

  async function getState() {
    const items = await chrome.storage.local.get(null);
    return items;
  }

  async function setState(key: string, value: any) {
    return await chrome.storage.local.set({ key: value });
  }

  function subscribe(callback: (state: ReturnType<typeof getState>) => void) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  return {
    getState,
    setState,
    subscribe,
  };
}
