<script setup lang="ts">
import { ref, watch } from 'vue';
import { withBase } from 'vitepress';
import type { EventInfo } from '../../events';

const props = defineProps<{ event: EventInfo; eager?: boolean }>();
const failed = ref(false);
watch(
  () => props.event.artwork?.src,
  () => {
    failed.value = false;
  },
);
</script>

<template>
  <div class="event-artwork" :data-surface="event.artwork?.surface ?? 'light'">
    <img
      v-if="event.artwork?.src && !failed"
      :src="withBase(event.artwork.src)"
      :alt="event.artwork.alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      width="720"
      height="280"
      @error="failed = true"
    />
    <div v-else class="event-artwork-fallback">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <template v-if="event.artwork?.symbol === 'book'">
          <path
            d="M32 17C22 11 12 11 7 13v37c8-2 16-1 25 4 9-5 17-6 25-4V13c-5-2-15-2-25 4Z M32 17v37"
          />
          <path d="M14 22c4 0 8 1 11 3m-11 7c4 0 8 1 11 3m14-10c3-2 7-3 11-3m-11 13c3-2 7-3 11-3" />
        </template>
        <template v-else-if="event.artwork?.symbol === 'data'">
          <path d="M10 49h46M16 41V29m16 12V17m16 24V9M12 20l17-9 16-5" />
          <circle cx="16" cy="49" r="3" />
          <circle cx="32" cy="49" r="3" />
          <circle cx="48" cy="49" r="3" />
        </template>
        <template v-else-if="event.artwork?.symbol === 'project'">
          <rect x="8" y="12" width="48" height="35" rx="5" />
          <path d="M8 22h48M21 55h22M32 47v8m-8-28-5 6 5 6m16-12 5 6-5 6" />
        </template>
        <template v-else>
          <path d="M23 19 9 32l14 13m18-26 14 13-14 13m-6-33-6 40" />
        </template>
      </svg>
      <strong>{{ event.eyebrow }}</strong>
      <small>{{ failed ? '图片暂不可用 · 主题图示' : '本站主题图示' }}</small>
    </div>
  </div>
</template>

<style scoped>
.event-artwork {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 140px;
  width: 100%;
  padding: 18px;
  background: #fff;
  color: #355391;
  border-radius: 10px;
  overflow: hidden;
}
.event-artwork[data-surface='dark'] {
  background: #20354e;
  color: #fff;
}
.event-artwork img {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: contain;
}
.event-artwork-fallback {
  display: grid;
  justify-items: center;
  gap: 9px;
  text-align: center;
}
.event-artwork-fallback svg {
  width: 54px;
  height: 54px;
}
.event-artwork-fallback strong {
  font-size: 18px;
  line-height: 1.4;
}
.event-artwork-fallback small {
  font-size: 10px;
  font-weight: 400;
  opacity: 0.7;
}
</style>
