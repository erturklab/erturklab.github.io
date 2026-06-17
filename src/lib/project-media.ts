import type { Project } from "./projects";
import { getProject, getProjects, resolveProjectIdFromNote } from "./projects";

export function getProjectHeroMedia(project: Project | undefined) {
  if (!project?.media?.[0]) return undefined;
  const hero = project.media[0];
  return {
    src: hero.src,
    title: hero.title,
    poster: project.image,
  };
}

export function getPublicationPreviewMedia(note?: string) {
  const projectId = resolveProjectIdFromNote(note);
  if (!projectId) return undefined;
  return getProjectHeroMedia(getProject(projectId));
}

export function getRelatedProjects(currentId: string, count = 3): Project[] {
  const all = getProjects();
  const index = all.findIndex((p) => p.id === currentId);
  if (index === -1) return all.filter((p) => p.id !== currentId).slice(0, count);
  const rotated = [...all.slice(index + 1), ...all.slice(0, index)];
  return rotated.filter((p) => p.id !== currentId).slice(0, count);
}
