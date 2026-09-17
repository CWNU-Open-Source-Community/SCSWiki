<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { eventStatus, type EventInfo } from '../../events';
import { useEventClock } from '../useEventClock';
import EventArtwork from './EventArtwork.vue';

const { frontmatter } = useData();
const event = computed(() => frontmatter.value.event as EventInfo);
const now = useEventClock();
const fields = computed(() => [
  ['参与形式', event.value.overview?.format ?? event.value.kind],
  ['主要内容', event.value.overview?.focus ?? event.value.tags.join('、')],
  ['建议基础', event.value.overview?.preparation ?? '按所选方向准备'],
  ['学习成果', event.value.overview?.deliverable ?? '参与记录与复盘'],
]);
const artworkLabels = {
  'official-mark': '官方标识',
  'official-visual': '官方主视觉',
  'project-mark': '所属项目 / 系列标识',
  theme: '本站主题图示',
};
</script>

<template>
  <section class="event-guide-profile" aria-label="活动信息">
    <figure class="event-guide-cover">
      <EventArtwork :event="event" eager />
      <figcaption v-if="event.artwork">
        <span>{{ artworkLabels[event.artwork.kind] }}</span>
        {{ event.artwork.source }}
      </figcaption>
    </figure>
    <div class="event-guide-facts">
      <div class="event-guide-status">
        <span>{{ event.scope === 'series' ? '常设活动指南' : '当届活动指南' }}</span>
        <span :class="{ pending: event.reviewRequired }">{{ eventStatus(event, now) }}</span>
      </div>
      <dl>
        <div v-for="[label, value] in fields" :key="label">
          <dt>{{ label }}</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
      <p v-if="event.aliases?.length" class="event-guide-aliases">
        简称与检索词：{{ event.aliases.join(' / ') }}
      </p>
    </div>
    <p class="event-guide-note">
      建议基础与学习产出由本站整理；参赛资格、报名和评审规则以主办方当届通知为准。
      <a :href="withBase('/events/')">返回活动目录 →</a>
    </p>
  </section>
</template>

<style scoped>
.event-guide-profile {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(0, 1.7fr);
  gap: 24px;
  padding: 24px;
  margin: 24px 0 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.event-guide-cover {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  min-width: 0;
}
.event-guide-cover figcaption {
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.65;
}
.event-guide-cover figcaption span {
  display: block;
  color: var(--vp-c-text-1);
  font-weight: 600;
  margin-bottom: 3px;
}
.event-guide-facts {
  min-width: 0;
}
.event-guide-status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.event-guide-status span {
  padding: 2px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
}
.event-guide-status .pending {
  color: var(--vp-c-warning-1);
  background: var(--vp-c-warning-soft);
  border-color: transparent;
}
dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin: 20px 0;
}
dt {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
dd {
  margin: 5px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.75;
  overflow-wrap: anywhere;
}
.event-guide-aliases,
.event-guide-note {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
.event-guide-note {
  grid-column: 1 / -1;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}
.event-guide-note a {
  white-space: nowrap;
}
@media (max-width: 600px) {
  .event-guide-profile {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 18px;
  }
  .event-guide-cover {
    gap: 8px;
  }
}
</style>
