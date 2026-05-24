import type { BuilderProject } from './types';

const STORAGE_KEY = 'ui-builder-projects-v1';

export function loadProjects(): BuilderProject[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuilderProject[];
  } catch {
    return null;
  }
}

export function saveProjects(projects: BuilderProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
