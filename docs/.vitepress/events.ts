import type { EventInfo } from './event-schema';
export type { EventInfo } from './event-schema';
export const eventKinds = ['开源活动', '学科竞赛', '社区共建'] as const;

export type EventItem = EventInfo & { title: string; description: string; url: string };
export type EventStatus =
  | '长期开放'
  | '报名中'
  | '报名已截止'
  | '即将开始'
  | '进行中'
  | '已结束'
  | '查看当届通知'
  | '时间待确认';

export function eventStatus(event: EventInfo, now: number): EventStatus {
  if (event.scope === 'series') return '查看当届通知';
  if (event.archived || (event.end && now >= Date.parse(event.end))) return '已结束';
  if (event.ongoing) return '长期开放';
  if (
    event.registrationOpen &&
    event.registrationClose &&
    now >= Date.parse(event.registrationOpen) &&
    now < Date.parse(event.registrationClose)
  )
    return '报名中';
  if (event.start && event.end && now >= Date.parse(event.start)) return '进行中';
  if (event.registrationClose && now >= Date.parse(event.registrationClose)) return '报名已截止';
  if (event.start && now < Date.parse(event.start)) return '即将开始';
  return '时间待确认';
}

export function filterEvents(
  items: EventItem[],
  filters: {
    query: string;
    kind: string;
    status: string;
    beginner: boolean;
    archive: boolean;
    topic?: string;
  },
  now: number,
) {
  const words = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((event) => {
    const status = eventStatus(event, now);
    const searchable = [
      event.title,
      event.description,
      event.eyebrow,
      event.topic,
      ...(event.aliases ?? []),
      ...event.tags,
    ]
      .join(' ')
      .toLocaleLowerCase();
    return (
      (filters.archive ? status === '已结束' : status !== '已结束') &&
      (!filters.kind || event.kind === filters.kind) &&
      (!filters.topic || event.topic === filters.topic) &&
      (!filters.status || status === filters.status) &&
      (!filters.beginner || event.beginner) &&
      words.every((word) => searchable.includes(word))
    );
  });
}
