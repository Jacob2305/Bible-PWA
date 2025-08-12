import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";

const BASE_POINTS = {
  post: 5,
  react: 1
};

const getLocalDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const isBeforeNoon = () => {
  const now = new Date();
  return now.getHours() < 12;
};

const getMostRecentActionDate = (timestamps = {}) => {
  const dates = Object.values(timestamps)
    .map(ts => new Date(ts).toISOString().split("T")[0]);
  return dates.length ? dates.sort().reverse()[0] : null;
};

export const updatePoints = async (uid, actionType) => {
  const base = BASE_POINTS[actionType] || 0;
  if (!uid || base === 0) return;

  const now = new Date();
  const today = getLocalDateString();

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const lastTimestamps = userData.lastPointTimestamps || {};

  const lastActionDate = lastTimestamps[actionType]
    ? new Date(lastTimestamps[actionType]).toISOString().split("T")[0]
    : null;

  if (lastActionDate === today) {
    return;
  }

  const mostRecentDate = getMostRecentActionDate(lastTimestamps);
  const isNewDay = mostRecentDate !== today;
  const newStreak = isNewDay ? (userData.streak || 0) + 1 : userData.streak || 0;

  const earned = isBeforeNoon() ? base * 2 : base;

  await updateDoc(userRef, {
    manna: increment(earned),
    streak: newStreak,
    [`lastPointTimestamps.${actionType}`]: now.toISOString(),
  });
};

