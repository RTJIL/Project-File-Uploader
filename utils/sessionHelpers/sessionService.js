import queries from "../../models/queries.js";

export async function deleteOldSessions(userId) {
  const sessions = await queries.findAll("session");

  for (const session of sessions) {
    try {
      const data = JSON.parse(session.data);
      if (data.passport?.user === userId)
        await queries.deleteSome(session, { sid: session.sid });
    } catch (err) {
      console.error("Failed to parse session data: ", err);
    }
  }
}
