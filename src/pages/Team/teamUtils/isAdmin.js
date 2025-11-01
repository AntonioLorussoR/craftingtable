export default function isAdmin(team, userId) {
  if (!team?.members || !userId) return false;

  return team.members.some(
    (m) =>
      String(m.user?._id || m.user) === String(userId) &&
      (m.role === "Admin" || m.role === "Creator")
  );
}
