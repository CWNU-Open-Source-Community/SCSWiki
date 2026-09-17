<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import { data as events } from '../../events.data';
import { eventKinds, eventStatus, filterEvents } from '../../events';
import { useEventClock } from '../useEventClock';
import EventArtwork from './EventArtwork.vue';

const query = ref('');
const kind = ref('');
const status = ref('');
const beginner = ref(false);
const archive = ref(false);
const topic = ref('');
const limit = ref(12);
const topics = [...new Set(events.map((event) => event.topic).filter(Boolean))].sort();
watch([query, kind, status, beginner, archive, topic], () => {
  limit.value = 12;
});
const now = useEventClock();
const visible = computed(() =>
  filterEvents(
    events,
    {
      query: query.value,
      kind: kind.value,
      status: status.value,
      beginner: beginner.value,
      archive: archive.value,
      topic: topic.value,
    },
    now.value,
  ),
);
const count = (category: string) =>
  events.filter(
    (event) =>
      (!category || event.kind === category) &&
      (archive.value
        ? eventStatus(event, now.value) === '已结束'
        : eventStatus(event, now.value) !== '已结束'),
  ).length;
const hasFilters = computed(
  () => query.value || kind.value || status.value || beginner.value || topic.value,
);
const reset = () => {
  query.value = '';
  kind.value = '';
  status.value = '';
  beginner.value = false;
  topic.value = '';
};
const switchArchive = (value: boolean) => {
  archive.value = value;
  status.value = '';
};
</script>

<template>
  <main class="events-page">
    <div class="events-wrap">
      <div class="events-breadcrumb">
        <a :href="withBase('/')">SCSWiki</a><span>/</span><span>成长与实践</span><span>/</span
        ><strong>活动与竞赛</strong>
      </div>
      <section class="events-hero" aria-labelledby="events-title">
        <div class="events-hero-copy">
          <p class="events-eyebrow"><span></span> DISCOVER · BUILD · CONTRIBUTE</p>
          <h1 id="events-title">把好奇心，<br />变成<span>下一次实践。</span></h1>
          <p class="events-lead">
            发现值得投入的开源活动与学科竞赛。<br />从第一次贡献，到和伙伴一起完成一个作品。
          </p>
          <div class="events-hero-actions">
            <a class="events-button primary" href="#explore"
              >探索活动 <span aria-hidden="true">↗</span></a
            ><a class="events-text-link" :href="withBase('/events/contribute')"
              >推荐一个活动 <span aria-hidden="true">＋</span></a
            >
          </div>
          <div class="events-hero-note">
            <span aria-hidden="true">◎</span> 学生维护 <i>·</i> 资料待核验 <i>·</i> 持续共建
          </div>
        </div>
        <div class="events-art" aria-hidden="true">
          <div class="events-orbit orbit-one"></div>
          <div class="events-orbit orbit-two"></div>
          <div class="art-label label-top">A SMALL STEP. A REAL CONTRIBUTION.</div>
          <div class="art-code">
            <span class="art-dots">● ● ●</span><span class="art-code-mark">&lt; / &gt;</span
            ><span class="art-code-line"></span><span class="art-code-line short"></span
            ><span class="art-code-caption">Hello, open source.</span>
          </div>
          <div class="art-chip chip-branch">
            <svg viewBox="0 0 24 24">
              <circle cx="6" cy="5" r="2" />
              <circle cx="6" cy="19" r="2" />
              <circle cx="18" cy="5" r="2" />
              <path d="M6 7v10m12-10c0 7-12 3-12 10" />
            </svg>
            Your first pull request
          </div>
          <div class="art-chip chip-star">✧ <span>一起创造一点不同</span></div>
          <div class="art-label label-bottom">LEARN BY DOING ↗</div>
        </div>
      </section>

      <section class="events-start" aria-label="第一次参与">
        <span class="start-icon" aria-hidden="true">↗</span>
        <div>
          <strong>第一次参与？从一个小贡献开始。</strong>
          <p>修正一处文档、补充一个来源，也是在参与开源。</p>
        </div>
        <a :href="withBase('/events/wiki-contribution')"
          >查看 SCSWiki 贡献指南 <span aria-hidden="true">→</span></a
        >
      </section>

      <section id="explore" class="events-explore" aria-labelledby="explore-title">
        <div class="events-section-heading">
          <div>
            <p class="events-eyebrow">FIND YOUR NEXT CHALLENGE</p>
            <h2 id="explore-title">
              {{ archive ? '往期活动' : '探索活动' }}<span>找到适合你的下一站</span>
            </h2>
          </div>
          <div class="events-view-switch" aria-label="活动时间范围">
            <button
              :class="{ active: !archive }"
              :aria-pressed="!archive"
              @click="switchArchive(false)"
            >
              活动目录</button
            ><button
              :class="{ active: archive }"
              :aria-pressed="archive"
              @click="switchArchive(true)"
            >
              历史归档
            </button>
          </div>
        </div>
        <div class="events-filter-panel">
          <div class="events-filter-top">
            <div class="events-tabs" aria-label="活动分类">
              <button :class="{ active: !kind }" :aria-pressed="!kind" @click="kind = ''">
                全部 <span>{{ count('') }}</span></button
              ><button
                v-for="category in eventKinds"
                :key="category"
                :class="{ active: kind === category }"
                :aria-pressed="kind === category"
                @click="kind = category"
              >
                {{ category }} <span>{{ count(category) }}</span>
              </button>
            </div>
            <div class="events-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" /></svg
              ><input
                v-model="query"
                type="search"
                aria-label="搜索活动"
                placeholder="搜索全称、简称或技术关键词"
              />
            </div>
          </div>
          <div class="events-filter-bottom">
            <div class="events-filter-options">
              <label
                >活动状态<select v-model="status" :disabled="archive">
                  <option value="">全部状态</option>
                  <option value="待核验">待核验</option>
                  <option
                    v-for="state in [
                      '长期开放',
                      '报名中',
                      '报名已截止',
                      '即将开始',
                      '进行中',
                      '时间待确认',
                      '查看当届通知',
                    ]"
                    :key="state"
                  >
                    {{ state }}
                  </option>
                </select></label
              ><label
                >实践方向<select v-model="topic">
                  <option value="">全部方向</option>
                  <option v-for="direction in topics" :key="direction" :value="direction">
                    {{ direction }}
                  </option>
                </select></label
              ><label class="events-checkbox"
                ><input v-model="beginner" type="checkbox" /> 新手友好</label
              ><button v-if="hasFilters" class="events-reset" @click="reset">重置筛选</button>
            </div>
            <span class="events-result" role="status" aria-live="polite"
              >共 {{ visible.length }} 个{{ archive ? '往期' : '' }}活动</span
            >
          </div>
        </div>
        <div v-if="visible.length" class="events-grid">
          <article v-for="event in visible.slice(0, limit)" :key="event.url" class="event-card">
            <a
              class="event-cover"
              :class="[`cover-${event.cover}`, { 'has-artwork': event.artwork }]"
              :href="withBase(event.url)"
              :aria-label="`查看${event.title}详情`"
              ><span class="cover-category">{{ event.kind }}</span>
              <EventArtwork v-if="event.artwork" :event="event" />
              <template v-else
                ><span class="cover-decoration" aria-hidden="true">{{
                  event.cover === 'wiki'
                    ? '{ }'
                    : event.cover === 'ladder'
                      ? '↗'
                      : event.cover === 'blue'
                        ? '⌘'
                        : event.cover === 'fest'
                          ? '✳'
                          : event.cover === 'summer'
                            ? '☼'
                            : '&lt;/&gt;'
                }}</span
                ><span class="cover-word">{{ event.eyebrow }}</span
                ><span class="cover-footer"
                  >{{ event.tags[0] }} <span aria-hidden="true">↗</span></span
                ></template
              ></a
            >
            <div class="event-card-body">
              <div class="event-card-meta">
                <span
                  class="event-status"
                  :class="{
                    live: ['报名中', '长期开放', '进行中'].includes(eventStatus(event, now)),
                  }"
                  ><span></span>{{ eventStatus(event, now) }}</span
                ><span v-if="event.beginner" class="event-beginner">新手友好</span>
              </div>
              <h3>
                <a :href="withBase(event.url)">{{ event.title }}</a>
              </h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-tags">
                <span v-for="tag in event.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="event-card-footer">
                <span>{{ event.schedule }}</span
                ><a :href="withBase(event.url)" :aria-label="`了解${event.title}`"
                  >了解详情 <span aria-hidden="true">↗</span></a
                >
              </div>
            </div>
          </article>
        </div>
        <div v-else class="events-empty">
          <span aria-hidden="true">⌕</span>
          <h3>{{ archive && !hasFilters ? '还没有归档活动' : '没有找到匹配的活动' }}</h3>
          <p>
            {{
              archive && !hasFilters
                ? '有明确结束时间的活动结束后，会自动出现在这里。'
                : '试试其他关键词，或清除筛选条件重新探索。'
            }}
          </p>
          <button v-if="hasFilters" class="events-button" @click="reset">清除筛选</button
          ><button v-else class="events-button" @click="switchArchive(false)">返回活动目录</button>
        </div>
        <div v-if="visible.length > limit" class="events-load-more">
          <button class="events-button" @click="limit += 12">
            加载更多活动（已显示 {{ Math.min(limit, visible.length) }} / {{ visible.length }}） ↓
          </button>
        </div>
        <p class="events-source-note">
          目录用于发现活动与赛事。待核验条目不表示正在报名，资格与日期需向主办方确认。新手友好是本站的入门建议。
          <a :href="withBase('/events/research')">查看收录范围、名称校正与来源核验 →</a>
        </p>
      </section>

      <section class="events-bottom">
        <div>
          <p class="events-eyebrow">BETTER TOGETHER</p>
          <h2>好机会，值得被更多人看见。</h2>
          <p>发现了一个活动，或想分享参与经验？把它带到这里。</p>
        </div>
        <a class="events-button" :href="withBase('/events/contribute')"
          >推荐活动 / 补充经验 <span aria-hidden="true">↗</span></a
        >
      </section>
      <nav class="events-learning" aria-label="实践准备资料">
        <span>出发前，补充一点装备</span
        ><a :href="withBase('/development/git-basics')">Git 入门 ↗</a
        ><a :href="withBase('/competitions/')">竞赛学习指南 ↗</a
        ><a :href="withBase('/about/contribute')">如何参与贡献 ↗</a>
      </nav>
    </div>
  </main>
</template>

<style src="../events.css"></style>
