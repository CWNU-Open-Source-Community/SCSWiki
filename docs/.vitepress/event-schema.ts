import { z } from 'zod';

import { eventKinds } from './events';
const timestamp = z.string().datetime({ offset: true });
export const eventSchema = z
  .object({
    kind: z.enum(eventKinds),
    scope: z.enum(['series', 'edition']).optional(),
    aliases: z.array(z.string().min(1)).optional(),
    topic: z.string().min(1).optional(),
    eyebrow: z.string().min(1),
    cover: z.enum(['summer', 'code', 'fest', 'blue', 'ladder', 'wiki']),
    tags: z.array(z.string().min(1)).min(1),
    beginner: z.boolean(),
    schedule: z.string().min(1),
    checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reviewRequired: z.boolean().optional(),
    artwork: z
      .object({
        src: z
          .string()
          .regex(/^\/events\/marks\/[a-z0-9-]+\.(?:png|jpg|webp)$/)
          .optional(),
        alt: z.string().min(1),
        kind: z.enum(['official-mark', 'official-visual', 'project-mark', 'theme']),
        source: z.string().min(1),
        surface: z.enum(['light', 'dark']),
        symbol: z.enum(['code', 'data', 'project', 'book']).optional(),
      })
      .refine((artwork) => artwork.kind === 'theme' || Boolean(artwork.src), {
        message: '正式标识或主视觉必须提供站内图片',
      })
      .optional(),
    overview: z
      .object({
        format: z.string().min(1),
        focus: z.string().min(1),
        preparation: z.string().min(1),
        deliverable: z.string().min(1),
      })
      .optional(),
    order: z.number(),
    ongoing: z.boolean().optional(),
    archived: z.boolean().optional(),
    registrationOpen: timestamp.optional(),
    registrationClose: timestamp.optional(),
    start: timestamp.optional(),
    end: timestamp.optional(),
  })
  .superRefine((event, context) => {
    if (
      event.scope === 'series' &&
      (event.ongoing ||
        event.archived ||
        event.registrationOpen ||
        event.registrationClose ||
        event.start ||
        event.end)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: '常设入口不得混入具体届次的报名、起止或归档状态',
      });
    }
    for (const [a, b] of [
      [event.registrationOpen, event.registrationClose],
      [event.start, event.end],
    ]) {
      if (a && b && Date.parse(a) >= Date.parse(b)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: '活动起止时间顺序错误' });
      }
    }
    if (event.registrationOpen && !event.registrationClose) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: '开放报名必须提供截止时间' });
    }
  });

export type EventInfo = z.infer<typeof eventSchema>;
