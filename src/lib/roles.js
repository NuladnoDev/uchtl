export const MODERATORS = ['dev'];

export function isModerator(profile) {
  if (!profile) return false;
  return profile.role === 'moderator' || MODERATORS.includes(profile.username);
}
