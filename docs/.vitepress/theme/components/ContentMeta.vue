<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';

type Source = {
  name: string;
  url: string;
};

const { frontmatter, page } = useData();

const contentTypeLabels: Record<string, string> = {
  'official-source': '公开正式来源整理',
  verified: '维护者核验',
  experience: '学生经验',
  archived: '历史归档',
};

const statusLabels: Record<string, string> = {
  draft: '草稿',
  active: '有效',
  'needs-review': '待核验',
  archived: '已归档',
};

const contentType = computed(() => String(frontmatter.value.content_type ?? ''));
const status = computed(() => String(frontmatter.value.status ?? ''));
const sources = computed<Source[]>(() => {
  const value = frontmatter.value.sources;
  return Array.isArray(value) ? value : [];
});

const lastUpdated = computed(() => page.value.lastUpdated || frontmatter.value.last_verified);

const formatDateTime = (value: unknown) => {
  if (!value) {
    return '暂无记录';
  }

  const date = value instanceof Date ? value : new Date(Number(value) || String(value));

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('zh-CN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const text = String(value);
  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : text;
};

const maintainers = computed(() => {
  const value = frontmatter.value.maintainers;
  return Array.isArray(value) ? value.join('、') : '未填写';
});

const audience = computed(() => {
  const value = frontmatter.value.audience;
  return Array.isArray(value) && value.length > 0 ? value.join('、') : '所有读者';
});

const needsStatusWarning = computed(() => ['draft', 'needs-review'].includes(status.value));
const isExperience = computed(() => contentType.value === 'experience');
</script>

<template>
  <section class="content-meta" aria-label="内容可信度信息">
    <div class="content-meta__header">
      <div class="content-meta__badges">
        <span class="content-meta__badge" :class="`is-type-${contentType}`">
          {{ contentTypeLabels[contentType] ?? contentType }}
        </span>
        <span
          class="content-meta__badge content-meta__badge--status"
          :class="`is-status-${status}`"
        >
          <span class="content-meta__dot" aria-hidden="true" />
          {{ statusLabels[status] ?? status }}
        </span>
      </div>
      <span class="content-meta__updated">更新于 {{ formatDateTime(lastUpdated) }}</span>
    </div>
    <div class="content-meta__body">
      <div class="content-meta__item">
        <strong>适用对象</strong>
        <span>{{ audience }}</span>
      </div>
      <div class="content-meta__item">
        <strong>维护者</strong>
        <span>{{ maintainers }}</span>
      </div>
      <div class="content-meta__item content-meta__item--sources">
        <strong>参考来源</strong>
        <div class="content-meta__sources">
          <template v-if="sources.length > 0">
            <a
              v-for="source in sources"
              :key="source.url"
              :href="source.url"
              target="_blank"
              rel="noreferrer"
            >
              {{ source.name }}
            </a>
          </template>
          <span v-else class="content-meta__empty">暂无公开来源，需补充核验</span>
        </div>
      </div>
    </div>
    <div v-if="isExperience" class="content-meta__warning">
      本页属于学生经验整理，仅供学习参考，不应视为学校正式规定。
    </div>
    <div v-if="needsStatusWarning" class="content-meta__warning">
      本页处于{{ statusLabels[status] }}状态，内容尚未完成充分核验，请结合官方通知确认。
    </div>
  </section>
</template>
