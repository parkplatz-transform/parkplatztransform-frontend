export function userCanEditSegment(user, ownerId) {
  if (user?.permission_level > 0) {
    return true;
  } else if (user?.id === ownerId) {
    return true;
  }
  return false;
}
