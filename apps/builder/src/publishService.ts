import type { PublishEventRepository } from './publishEventRepository';
import type { PageVersion, PublishRecord } from './types';

export type PublishService = {
  createRestoreVersionEvent: (input: {
    projectId: string;
    pageId: string;
    actorId: string;
    version: PageVersion;
  }) => Promise<void>;
  createPublishEvent: (input: {
    projectId: string;
    pageId: string;
    actorId: string;
    latestVersion: PageVersion | null;
    publish: PublishRecord;
  }) => Promise<void>;
  createUnpublishEvent: (input: {
    projectId: string;
    pageId: string;
    actorId: string;
  }) => Promise<void>;
};

function createBaseEventId() {
  return `publish-event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createPublishService({
  publishEventsRepository,
}: {
  publishEventsRepository: PublishEventRepository;
}): PublishService {
  return {
    async createRestoreVersionEvent({ projectId, pageId, actorId, version }) {
      await publishEventsRepository.createEvent({
        id: createBaseEventId(),
        projectId,
        pageId,
        type: 'restored-version',
        actorId,
        createdAt: new Date().toISOString(),
        sourceVersionId: version.id,
        note: `Restored ${version.label}`,
      });
    },
    async createPublishEvent({
      projectId,
      pageId,
      actorId,
      latestVersion,
      publish,
    }) {
      await publishEventsRepository.createEvent({
        id: createBaseEventId(),
        projectId,
        pageId,
        type: 'published',
        actorId,
        createdAt: publish.publishedAt ?? new Date().toISOString(),
        sourceVersionId: latestVersion?.id ?? null,
        note: latestVersion
          ? `Published from ${latestVersion.label}`
          : 'Published project',
      });
    },
    async createUnpublishEvent({ projectId, pageId, actorId }) {
      await publishEventsRepository.createEvent({
        id: createBaseEventId(),
        projectId,
        pageId,
        type: 'unpublished',
        actorId,
        createdAt: new Date().toISOString(),
        sourceVersionId: null,
        note: 'Unpublished project',
      });
    },
  };
}
