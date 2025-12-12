import { BirthData } from '../types';

const DB_NAME = 'MetaReikiAstroDB';
const STORE_NAME = 'profiles';
const DB_VERSION = 1;

export interface StoredProfile extends BirthData {
  id: string;
  createdAt: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveProfile = async (data: BirthData): Promise<StoredProfile> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const newProfile: StoredProfile = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: Date.now()
    };

    const request = store.put(newProfile);
    
    request.onsuccess = () => resolve(newProfile);
    request.onerror = () => reject(request.error);
  });
};

export const getProfiles = async (): Promise<StoredProfile[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
        const results = request.result as StoredProfile[];
        // Sort by newest first
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteProfile = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};