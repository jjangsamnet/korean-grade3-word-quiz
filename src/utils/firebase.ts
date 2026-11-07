import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface LeaderboardRecord {
  id?: string;
  nickname: string;
  score: number;
  stars: number;
  accuracy: number;
  maxCombo: number;
  levelsCleared: number;
  badgeTitle: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, operating with cache.');
      return false;
    }
    return true;
  }
}

// Subscribe to top 50 leaderboard entries in real time
export function subscribeToLeaderboard(
  onUpdate: (records: LeaderboardRecord[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'leaderboard';
  const q = query(collection(db, path), orderBy('score', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: LeaderboardRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        records.push({
          id: docSnap.id,
          nickname: data.nickname || '익명 탐험가',
          score: Number(data.score) || 0,
          stars: Number(data.stars) || 1,
          accuracy: Number(data.accuracy) || 0,
          maxCombo: Number(data.maxCombo) || 0,
          levelsCleared: Number(data.levelsCleared) || 1,
          badgeTitle: data.badgeTitle || '탐험가',
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
        });
      });
      onUpdate(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

// Save a new score entry to Firestore
export async function saveScoreToLeaderboard(entry: Omit<LeaderboardRecord, 'id'>): Promise<string | null> {
  const path = 'leaderboard';
  try {
    const payload = {
      nickname: entry.nickname.trim().slice(0, 30),
      score: Math.max(0, Math.min(100000, Math.round(entry.score))),
      stars: Math.max(1, Math.min(3, Math.round(entry.stars))),
      accuracy: Math.max(0, Math.min(100, Math.round(entry.accuracy))),
      maxCombo: Math.max(0, Math.min(50, Math.round(entry.maxCombo))),
      levelsCleared: Math.max(1, Math.min(5, Math.round(entry.levelsCleared))),
      badgeTitle: entry.badgeTitle.slice(0, 50),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}
