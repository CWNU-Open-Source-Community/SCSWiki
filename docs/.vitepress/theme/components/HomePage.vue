<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';
import { siteSections } from '../../site-map';

type Contributor = {
  avatar_url: string;
  contributions?: number;
  html_url: string;
  login: string;
};

type HomeLink = {
  description: string;
  href: string;
  title: string;
};

const repositoryUrl = 'https://github.com/CWNU-Open-Source-Community/SCSWiki';
const contributorsUrl = `${repositoryUrl}/graphs/contributors`;
const qqGroupNumber = '1036399266';
const qqGroupUrl = 'https://qm.qq.com/q/GKen4KYYaC';
const fallbackContributors: Contributor[] = [
  {
    avatar_url: 'https://github.com/pppolf.png?size=96',
    html_url: 'https://github.com/pppolf',
    login: 'pppolf',
  },
];

const contributors = ref<Contributor[]>(fallbackContributors);
const searchShortcut = ref('Ctrl K');

const quickLinks: HomeLink[] = [
  {
    description: '报到准备、缴费资助与新生问答',
    href: '/start/',
    title: '新生报到指南',
  },
  {
    description: '培养方案、选课制度与开课查询',
    href: '/course/',
    title: '培养方案与选课',
  },
  {
    description: '课程笔记、实验参考与复习资料',
    href: '/materials/',
    title: '课程学习资料',
  },
  {
    description: '开源活动、学科竞赛与实践入口',
    href: '/events/',
    title: '活动与竞赛中心',
  },
];

const hotTopics = [
  { href: '/start/', label: '2026 新生报到' },
  { href: '/course/xk', label: '通识选课查询' },
  { href: '/materials/', label: '课程复习资料' },
  { href: '/services/', label: '办事指南' },
];

const trustItems = [
  {
    code: '01',
    description: '涉及政策、流程、时间、人员、联系方式、课程规则等内容，不把学生经验写成正式规定。',
    title: '高风险信息先核验',
  },
  {
    code: '02',
    description: '缺少可靠来源时，页面应保留为 needs-review 或模板状态，等待公开资料补齐。',
    title: '待核验内容明确标记',
  },
  {
    code: '03',
    description: '不公开真实个人联系方式、学号、手机号、群号、内部系统链接或隐私信息。',
    title: '隐私信息不进入页面',
  },
];

const visibleContributors = computed(() => contributors.value.slice(0, 8));

const openSearch = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const searchButton = document.querySelector<HTMLElement>('.DocSearch-Button');
  searchButton?.click();
};

onMounted(async () => {
  if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    searchShortcut.value = '⌘ K';
  }

  try {
    const response = await fetch(withBase('/contributors.json'));

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as Contributor[];
    if (Array.isArray(data) && data.length > 0) {
      contributors.value = data.filter((item) => item.login && item.avatar_url && item.html_url);
    }
  } catch {
    contributors.value = fallbackContributors;
  }
});
</script>

<template>
  <main class="scs-home">
    <section class="scs-home-hero" aria-labelledby="home-title">
      <div class="scs-home-hero__inner">
        <div class="scs-hero-copy">
          <div class="scs-kicker">
            <span class="scs-kicker__dot" aria-hidden="true" />
            <span>西华师范大学计算机学院 · 非官方学生知识库</span>
          </div>
          <h1 id="home-title">SCSWiki</h1>
          <p class="scs-hero-lead">
            面向计算机学院同学的开放知识库，系统整理入学报到、培养方案、课程资料、学科竞赛与校园办事指南。
          </p>

          <div class="scs-hero-search-wrap">
            <button
              class="scs-search-bar"
              type="button"
              aria-label="打开知识库站内搜索"
              @click="openSearch"
            >
              <svg
                class="scs-search-bar__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8" />
              </svg>
              <span class="scs-search-bar__placeholder">
                搜索文档、课程、选课制度、新生报到或办事指南...
              </span>
              <kbd class="scs-search-bar__kbd">{{ searchShortcut }}</kbd>
            </button>
            <div class="scs-hot-topics" aria-label="热门专题">
              <span class="scs-hot-topics__label">常见查询</span>
              <a
                v-for="topic in hotTopics"
                :key="topic.href"
                class="scs-hot-topics__chip"
                :href="withBase(topic.href)"
              >
                {{ topic.label }}
              </a>
            </div>
          </div>

          <div class="scs-actions" aria-label="主要入口">
            <a class="scs-button primary" :href="withBase('/start/')">从新生指南开始</a>
            <a class="scs-button secondary" href="#site-map">浏览知识库目录</a>
          </div>

          <p class="scs-hero-support">
            来源优先，政策与流程请以学校或学院正式通知为准。交流与反馈：
            <a
              class="scs-qq-group-link"
              :href="qqGroupUrl"
              :aria-label="`通过 QQ 加入交流群 ${qqGroupNumber}`"
              title="点击通过 QQ 加入群"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
                />
              </svg>
              QQ群：{{ qqGroupNumber }}
            </a>
          </p>
        </div>

        <aside class="scs-hero-panel" aria-label="常用入口">
          <div class="scs-panel-head">
            <div class="scs-panel-label">快速索引</div>
            <span class="scs-panel-caption">高频文档</span>
          </div>
          <div class="scs-quick-list">
            <a
              v-for="item in quickLinks"
              :key="item.href"
              class="scs-quick-link"
              :href="withBase(item.href)"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </a>
          </div>
          <a class="scs-panel-link" :href="withBase('/faq/content-correction')">
            <span>反馈错误或过期内容</span>
          </a>
        </aside>
      </div>
    </section>

    <section
      id="site-map"
      class="scs-section scs-section--site-map"
      aria-labelledby="content-title"
    >
      <div class="scs-section-heading scs-section-heading--split">
        <div>
          <span>Directory · 知识库目录</span>
          <h2 id="content-title">按主题查阅文档</h2>
        </div>
        <p>全站内容按六大专题归档；也可以使用搜索框快速检索具体条目。</p>
      </div>

      <div class="scs-grid" aria-label="六类内容入口">
        <article
          v-for="section in siteSections"
          :key="section.primaryHref"
          class="scs-card"
          :class="{ featured: section.index === '01' }"
        >
          <div class="scs-card-topline">
            <span class="scs-card-index" aria-hidden="true">{{ section.index }}</span>
            <span class="scs-card-count">{{ section.links.length }} 个子栏目</span>
          </div>
          <a class="scs-card-heading" :href="withBase(section.primaryHref)">
            <strong>{{ section.title }}</strong>
            <span class="scs-card-arrow" aria-hidden="true">→</span>
          </a>
          <p class="scs-card-description">{{ section.description }}</p>
          <nav class="scs-card-links" :aria-label="`${section.title}子栏目`">
            <a v-for="link in section.links" :key="link.href" :href="withBase(link.href)">
              {{ link.title }}
            </a>
          </nav>
        </article>
      </div>
    </section>

    <section class="scs-section scs-section--trust" aria-labelledby="trust-title">
      <div class="scs-section-heading">
        <span>Trust Boundary · 收录与核验规范</span>
        <h2 id="trust-title">把可信度写在每一页里</h2>
      </div>

      <div class="scs-trust-grid">
        <div v-for="item in trustItems" :key="item.title" class="scs-trust-item">
          <span class="scs-trust-code" aria-hidden="true">{{ item.code }}</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="scs-community-section" aria-label="开源维护">
      <div class="scs-community-copy">
        <span>Open Source · 开源共建</span>
        <strong>由同学持续维护，也欢迎你一起修正与补充。</strong>
        <p>
          发现内容错误、来源缺失或页面过期时，可以通过仓库 Issue、Pull Request
          或每页底部的编辑入口参与维护。
        </p>
      </div>
      <div class="scs-github-strip" aria-label="GitHub 贡献者">
        <span>Contributors</span>
        <div class="scs-avatar-group">
          <a
            v-for="contributor in visibleContributors"
            :key="contributor.login"
            class="scs-avatar-link"
            :href="contributor.html_url"
            :aria-label="`${contributor.login} 的 GitHub 主页`"
            :title="`${contributor.login}${contributor.contributions ? ` · ${contributor.contributions} commits` : ''}`"
          >
            <img :src="contributor.avatar_url" :alt="contributor.login" />
          </a>
        </div>
        <div class="scs-repo-actions">
          <a class="scs-repo-link" :href="contributorsUrl">贡献者列表</a>
          <a class="scs-repo-link subtle" :href="repositoryUrl">GitHub 仓库</a>
        </div>
      </div>
    </section>
  </main>
</template>
