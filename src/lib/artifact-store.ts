import type { ParsedArtifact } from '@/components/ArtifactRenderer';

const STORAGE_KEY = 'lovelab-artifacts';
const MAX_ARTIFACTS = 50;

export interface SavedArtifact {
  id: string;
  type: ParsedArtifact['type'];
  code: string;
  title: string;
  savedAt: string;
  prompt?: string;
  truncated?: boolean;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getArtifacts(): SavedArtifact[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveArtifact(
  artifact: ParsedArtifact,
  prompt?: string,
): SavedArtifact {
  const saved: SavedArtifact = {
    id: generateId(),
    type: artifact.type,
    code: artifact.code,
    title: artifact.title || 'Untitled',
    savedAt: new Date().toISOString(),
    prompt,
    truncated: artifact.truncated,
  };

  const list = getArtifacts();
  list.unshift(saved);

  if (list.length > MAX_ARTIFACTS) {
    list.length = MAX_ARTIFACTS;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage full — drop oldest half and retry
    list.length = Math.floor(MAX_ARTIFACTS / 2);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }

  return saved;
}

export function deleteArtifact(id: string): void {
  const list = getArtifacts().filter((a) => a.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function clearArtifacts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function artifactToParseFormat(saved: SavedArtifact): ParsedArtifact {
  return {
    type: saved.type,
    code: saved.code,
    title: saved.title,
    truncated: saved.truncated,
  };
}
