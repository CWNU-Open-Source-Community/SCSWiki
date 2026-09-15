import { onMounted, onUnmounted, ref } from 'vue';
import { data as builtAt } from '../event-clock.data';

export function useEventClock() {
  // The generated timestamp is identical in server HTML and the hydration bundle.
  const now = ref(builtAt);
  let timer: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    now.value = Date.now();
    timer = setInterval(() => {
      now.value = Date.now();
    }, 60000);
  });
  onUnmounted(() => clearInterval(timer));
  return now;
}
