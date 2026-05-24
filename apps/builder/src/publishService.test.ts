import { describe, expect, it } from 'vitest';
import { createInMemoryPublishEventRepository } from './publishEventRepository';
import { createPublishService } from './publishService';

describe('publishService', () => {
  it('creates publish event', async () => {
    const repo = createInMemoryPublishEventRepository();
    const service = createPublishService({ publishEventsRepository: repo });
    await service.createPublishEvent({
      projectId: 'p1',
      pageId: 'home',
      actorId: 'u1',
      latestVersion: null,
      publish: {
        status: 'published',
        publishedAt: '2026-01-01',
        publishedBy: 'u1',
        sourceVersionId: null,
      },
    });
    const events = await repo.listEvents('p1');
    expect(events[0]?.type).toBe('published');
  });
});
