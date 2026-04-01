import { query } from "../db/connection.js";

export const checkUserByName = async (name, sendUserData = false) => {
  const result = await query(`SELECT * FROM users WHERE username=$1`, [name]);
  if (sendUserData) {
    return result.rows[0];
  } else {
    return result.rows.length > 0;
  }
};

export const checkUserByEmail = async (email, sendUserData = false) => {
  const result = await query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (sendUserData) {
    return result.rows[0];
  } else {
    return result.rows.length > 0;
  }
};

export const registerUser = async ({ username, email, hashedPassword }) => {
  const user = await query(
    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [username, email, hashedPassword],
  );
  // console.log(user.rows[0]);
  return user.rows[0];
};

export const findUserById = async (id) => {
  const user = await query(
    `
    SELECT id,username,email FROM users WHERE id = $1
        `,
    [id],
  );
  return user.rows[0];
};

export const createSession = async ({
  userId,
  refreshTokenHash,
  ip,
  userAgent,
}) => {
  const session = await query(
    `INSERT INTO sessions (user_id, refresh_token_hash, ip, user_agent) VALUES ($1,$2,$3,$4) RETURNING *`,
    [userId, refreshTokenHash, ip, userAgent],
  );

  return session.rows[0];
};

export const getSessionByHash = async (refreshTokenHash) => {
  const session = await query(
    `SELECT * FROM sessions WHERE refresh_token_hash = $1 and revoked = $2`,
    [refreshTokenHash, false],
  );

  return session.rows[0];
};

export const updateSessionById = async (sessionId) => {
  await query(`UPDATE sessions SET revoked = true WHERE id = $1`, [sessionId]);
};

export const editSessionHash = async (sessionId, sessionHash) => {
  await query(`UPDATE sessions SET refresh_token_hash=$1 WHERE id=$2`, [
    sessionHash,
    sessionId,
  ]);
};

export const editUserSessions = async (userId) => {
  await query(`UPDATE sessions SET revoked=true WHERE id=$1`, [userId]);
};
