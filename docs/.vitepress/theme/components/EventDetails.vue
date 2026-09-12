<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { eventStatus, type EventInfo } from '../../events';
import { useEventClock } from '../useEventClock';
const { frontmatter } = useData();
const event = computed(() => frontmatter.value.event as EventInfo);
const now = useEventClock();
</script>

<template>
  <div class="event-detail-summary">
    <a :href="withBase('/events/')">← 返回活动与竞赛中心</a>
    <dl>
      <div>
        <dt>收录范围</dt>
        <dd>{{ event.scope === 'series' ? '常设赛事 / 活动入口' : '具体活动' }}</dd>
      </div>
      <div v-if="event.aliases?.length">
        <dt>简称与检索词</dt>
        <dd>{{ event.aliases.join(' / ') }}</dd>
      </div>
      <div>
        <dt>活动类型</dt>
        <dd>{{ event.kind }}</dd>
      </div>
      <div>
        <dt>当前状态</dt>
        <dd>{{ eventStatus(event, now) }}</dd>
      </div>
      <div>
        <dt>时间安排</dt>
        <dd>{{ event.schedule }}</dd>
      </div>
      <div>
        <dt>资料核查</dt>
        <dd>{{ event.checked }}</dd>
      </div>
    </dl>
    <a class="detail-official" :href="event.official" target="_blank" rel="noopener noreferrer"
      >{{ event.kind === '社区共建' ? '前往项目仓库' : '前往活动官网' }} ↗</a
    >
    <p>具体资格、报名与安排以链接中的最新规则为准。</p>
  </div>
</template>

<style scoped>
.event-detail-summary {
  margin: 24px 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 24px 0;
}
dt {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
dd {
  margin: 4px 0 0;
  font-weight: 600;
}
.event-detail-summary .detail-official {
  display: inline-flex;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
}
.event-detail-summary p {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 0;
}
@media (max-width: 480px) {
  dl {
    grid-template-columns: 1fr;
  }
}
</style>
