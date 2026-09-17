import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { eventSchema } from '../../docs/.vitepress/event-schema';
import { eventStatus, filterEvents, type EventItem } from '../../docs/.vitepress/events';
import { eventSidebar } from '../../docs/.vitepress/event-sidebar';

const fixture: EventItem = {
  title: 'Open Source 实践',
  description: '与社区协作',
  url: '/events/test',
  kind: '开源活动',
  eyebrow: 'CODE',
  cover: 'code',
  tags: ['Git', 'TypeScript'],
  beginner: true,
  schedule: '测试时间',
  checked: '2026-09-12',
  order: 1,
  registrationOpen: '2026-09-01T00:00:00+08:00',
  registrationClose: '2026-09-10T00:00:00+08:00',
  start: '2026-09-15T00:00:00+08:00',
  end: '2026-09-20T00:00:00+08:00',
};
const at = (date: string) => Date.parse(`${date}T00:00:00+08:00`);
const filters = { query: '', kind: '', status: '', beginner: false, archive: false };

describe('活动状态与筛选', () => {
  it('待核验活动不会因历史时间而显示报名中或进行中', () => {
    const pending = { ...fixture, reviewRequired: true };
    for (const date of ['2026-09-01', '2026-09-15', '2026-09-20']) {
      expect(eventStatus(pending, at(date))).toBe('待核验');
      expect(filterEvents([pending], { ...filters, status: '报名中' }, at(date))).toHaveLength(0);
      expect(filterEvents([pending], { ...filters, status: '待核验' }, at(date))).toHaveLength(1);
    }
  });
  it('常设入口不推测当前报名状态，且不可混入具体届次时间', () => {
    const series = {
      ...fixture,
      scope: 'series' as const,
      registrationOpen: undefined,
      registrationClose: undefined,
      start: undefined,
      end: undefined,
    };
    expect(eventStatus(series, at('2026-09-12'))).toBe('查看当届通知');
    expect(filterEvents([series], { ...filters, archive: true }, at('2030-09-12'))).toHaveLength(0);
    expect(eventSchema.safeParse(series).success).toBe(true);
    expect(eventSchema.safeParse({ ...series, ongoing: true }).success).toBe(false);
    expect(eventSchema.safeParse({ ...series, end: fixture.end }).success).toBe(false);
  });
  it('正式名称之外支持历史称呼检索，并与实践方向组合筛选', () => {
    const renamed = { ...fixture, aliases: ['互联网+'], topic: '创新创业' };
    expect(
      filterEvents(
        [renamed],
        { ...filters, query: '互联网+', topic: '创新创业' },
        at('2026-09-12'),
      ),
    ).toHaveLength(1);
    expect(
      filterEvents(
        [renamed],
        { ...filters, query: '互联网+', topic: '网络安全' },
        at('2026-09-12'),
      ),
    ).toHaveLength(0);
  });
  it('在报名、开始和结束边界更新状态，不将截止后的活动显示为报名中', () => {
    expect(eventStatus(fixture, at('2026-09-01'))).toBe('报名中');
    expect(eventStatus(fixture, at('2026-09-10'))).toBe('报名已截止');
    expect(eventStatus(fixture, at('2026-09-15'))).toBe('进行中');
    expect(eventStatus(fixture, at('2026-09-20'))).toBe('已结束');
    expect(eventStatus(fixture, Date.parse('2026-09-09T16:00:00Z'))).toBe('报名已截止');
  });
  it('未核验时间不猜测开放报名，长期入口和手动归档保持明确', () => {
    const unknown = {
      ...fixture,
      registrationOpen: undefined,
      registrationClose: undefined,
      start: undefined,
      end: undefined,
    };
    expect(eventStatus(unknown, at('2026-09-12'))).toBe('时间待确认');
    expect(eventStatus({ ...unknown, ongoing: true }, at('2026-09-12'))).toBe('长期开放');
    expect(eventStatus({ ...unknown, ongoing: true, archived: true }, at('2026-09-12'))).toBe(
      '已结束',
    );
  });
  it('支持组合筛选、大小写和空白，并把已结束活动放入归档', () => {
    expect(
      filterEvents(
        [fixture],
        { ...filters, query: '  OPEN   git ', kind: '开源活动', beginner: true },
        at('2026-09-12'),
      ),
    ).toHaveLength(1);
    expect(
      filterEvents([fixture], { ...filters, kind: '学科竞赛' }, at('2026-09-12')),
    ).toHaveLength(0);
    expect(
      filterEvents([fixture], { ...filters, status: '报名中' }, at('2026-09-12')),
    ).toHaveLength(0);
    expect(filterEvents([fixture], filters, at('2026-09-20'))).toHaveLength(0);
    expect(filterEvents([fixture], { ...filters, archive: true }, at('2026-09-20'))).toHaveLength(
      1,
    );
  });
  it('拒绝没有截止时间的开放报名及倒序日期', () => {
    expect(eventSchema.safeParse({ ...fixture, registrationClose: undefined }).success).toBe(false);
    expect(eventSchema.safeParse({ ...fixture, end: fixture.start }).success).toBe(false);
  });
  it('所有实际活动使用有效字段，无外部跳转时保持待核验及导航一致', () => {
    const root = path.resolve('docs/events');
    const entries = fs
      .readdirSync(root)
      .filter((file) => file.endsWith('.md'))
      .map((file) => matter.read(path.join(root, file)).data)
      .filter((data) => data.event);
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(entries.length);
    const navigation = eventSidebar().flatMap((group) => group.items ?? []);
    for (const entry of entries) {
      const event = eventSchema.parse(entry.event);
      expect(event.aliases?.length).toBeGreaterThan(0);
      expect(event.topic).toBeTruthy();
      expect(event.overview).toBeDefined();
      expect(event.artwork).toBeDefined();
      if (event.artwork?.src) {
        const asset = fs.readFileSync(path.resolve('docs/public', `.${event.artwork.src}`));
        expect(asset.subarray(0, 4).toString()).toBe('RIFF');
        expect(asset.subarray(8, 12).toString()).toBe('WEBP');
      } else {
        expect(event.artwork?.kind).toBe('theme');
        expect(event.artwork?.symbol).toBeTruthy();
      }
      expect(navigation.filter((item) => item.text === entry.title)).toHaveLength(1);
      expect(entry.sources).toEqual([]);
      expect(entry.status).toBe('needs-review');
      expect(event.reviewRequired).toBe(true);
      expect(entry.event).not.toHaveProperty('official');
    }
    for (const file of fs.readdirSync(root).filter((file) => file.endsWith('.md'))) {
      expect(fs.readFileSync(path.join(root, file), 'utf8')).not.toMatch(/\bhttps?:\/\/|\bwww\./i);
    }
  });
  it('正式图像需有站内资源，不能使用越界路径', () => {
    const artwork = {
      kind: 'official-mark',
      alt: '测试标识',
      source: '官方入口',
      surface: 'light',
    };
    expect(eventSchema.safeParse({ ...fixture, artwork }).success).toBe(false);
    expect(
      eventSchema.safeParse({
        ...fixture,
        artwork: { ...artwork, src: '/events/marks/../outside.webp' },
      }).success,
    ).toBe(false);
    expect(
      eventSchema.safeParse({
        ...fixture,
        artwork: { ...artwork, src: '/events/marks/gplt.webp' },
      }).success,
    ).toBe(true);
  });
});
