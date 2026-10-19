<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = withDefaults(
  defineProps<{
    src: string;
    title: string;
    downloadName: string;
    pages: number;
    loading?: 'eager' | 'lazy';
  }>(),
  { loading: 'lazy' },
);

const fileUrl = computed(() => withBase(props.src));
const readerUrl = computed(() => `${fileUrl.value}#page=1&view=FitH&navpanes=0`);
</script>

<template>
  <div class="pdf-reader">
    <div class="pdf-reader__actions">
      <span>PDF · {{ pages }} 页</span>
      <a :href="fileUrl" :download="downloadName" :aria-label="`下载《${title}》PDF`"> 下载 PDF </a>
    </div>
    <iframe class="pdf-reader__frame" :src="readerUrl" :title="title" :loading="loading" />
  </div>
</template>

<style scoped>
.pdf-reader {
  margin: 24px 0 40px;
}

.pdf-reader__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.pdf-reader__frame {
  display: block;
  width: 100%;
  height: clamp(520px, 82vh, 1080px);
  border: 1px solid var(--vp-c-divider);
  background: #faf9f6;
}

@media (max-width: 640px) {
  .pdf-reader__frame {
    height: 75svh;
    min-height: 480px;
  }
}
</style>
