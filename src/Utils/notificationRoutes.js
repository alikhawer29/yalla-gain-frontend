/**
 * Resolve admin navigation path from a notification's target_type / target_id.
 */
export function getNotificationTargetPath(notification) {
  const targetType = notification?.target_type;
  const targetId = notification?.target_id;

  if (!targetType || targetId == null || targetId === "") return null;

  switch (targetType) {
    case "user":
      return `/admin/user-management/${targetId}`;
    case "doctor":
      return `/admin/doctor-management/${targetId}`;
    case "trainer":
      return `/admin/trainer-management/${targetId}`;
    case "appointment":
      return `/admin/appointments/${targetId}`;
    case "feedback":
      return `/admin/query-management/${targetId}`;
    case "chat":
      return `/admin/chat?chatId=${encodeURIComponent(String(targetId))}`;
    default:
      return null;
  }
}
