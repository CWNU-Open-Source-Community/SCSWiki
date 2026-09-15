import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { DefaultTheme } from 'vitepress';
import { eventSchema } from './event-schema';
import { eventKinds } from './events';

// Build-time only: titles share the same source as the directory and detail pages.
export function eventSidebar(): DefaultTheme.SidebarItem[] {
  const root = path.resolve('docs/events');
  const entries = fs
    .readdirSync(root)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const { data } = matter.read(path.join(root, file));
      if (!data.event) return [];
      return [
        {
          title: String(data.title),
          link: `/events/${file.slice(0, -3)}`,
          event: eventSchema.parse(data.event),
        },
      ];
    })
    .sort((a, b) => a.event.order - b.event.order);
  return [
    {
      text: '活动与竞赛',
      items: [
        { text: '探索活动', link: '/events/' },
        { text: '收录研究与名称核验', link: '/events/research' },
        { text: '推荐活动与补充经验', link: '/events/contribute' },
        { text: '竞赛学习指南', link: '/competitions/' },
      ],
    },
    ...eventKinds.map((kind) => ({
      text: kind,
      collapsed: true,
      items: entries
        .filter((entry) => entry.event.kind === kind)
        .map((entry) => ({ text: entry.title, link: entry.link })),
    })),
  ];
}
