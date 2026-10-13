export interface StoredResumeFileMeta {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface IResumeStorageService {
  saveResumeFile(userId: string, versionId: string, file: File | Blob, filename: string): Promise<string>;
  getResumeFile(userId: string, versionId: string): Promise<Blob | null>;
  deleteResumeFile(userId: string, versionId: string): Promise<void>;
  downloadResumeFile(userId: string, versionId: string, filename: string): Promise<void>;
  getUserFiles(userId: string): Promise<StoredResumeFileMeta[]>;
}

const DB_NAME = 'CareerOS_Storage_v2';
const DB_VERSION = 1;
const STORE_NAME = 'resume_files';

class IndexedDBStorageService implements IResumeStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open CareerOS secure IndexedDB.'));
      };
    });

    return this.dbPromise;
  }

  public async saveResumeFile(
    userId: string,
    versionId: string,
    file: File | Blob,
    filename: string
  ): Promise<string> {
    if (!userId) throw new Error('Unauthorized: A valid userId is required to store resume assets.');

    const db = await this.getDB();
    const record = {
      id: `${userId}__${versionId}`,
      userId,
      versionId,
      filename,
      mimeType: file.type || 'application/pdf',
      size: file.size,
      fileBlob: file,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(record.id);
      req.onerror = () => reject(req.error || new Error('Failed to store resume blob in IndexedDB.'));
    });
  }

  public async getResumeFile(userId: string, versionId: string): Promise<Blob | null> {
    if (!userId) return null;
    const db = await this.getDB();
    const recordId = `${userId}__${versionId}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(recordId);

      req.onsuccess = () => {
        const result = req.result;
        if (!result) {
          resolve(null);
          return;
        }
        // Strict user isolation check
        if (result.userId !== userId) {
          reject(new Error('Access Denied: Resume file belongs to a different user profile.'));
          return;
        }
        resolve(result.fileBlob as Blob);
      };
      req.onerror = () => reject(req.error || new Error('Failed to retrieve resume blob.'));
    });
  }

  public async deleteResumeFile(userId: string, versionId: string): Promise<void> {
    if (!userId) return;
    const db = await this.getDB();
    const recordId = `${userId}__${versionId}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      // Verify ownership before deleting
      const getReq = store.get(recordId);

      getReq.onsuccess = () => {
        const item = getReq.result;
        if (item && item.userId === userId) {
          const deleteReq = store.delete(recordId);
          deleteReq.onsuccess = () => resolve();
          deleteReq.onerror = () => reject(deleteReq.error);
        } else {
          resolve();
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  public async downloadResumeFile(userId: string, versionId: string, filename: string): Promise<void> {
    const blob = await this.getResumeFile(userId, versionId);
    if (!blob) {
      throw new Error('Resume file not found in local secure storage.');
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  public async getUserFiles(userId: string): Promise<StoredResumeFileMeta[]> {
    if (!userId) return [];
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const req = index.getAll(userId);

      req.onsuccess = () => {
        const records = req.result || [];
        resolve(
          records.map((r: any) => ({
            id: r.versionId,
            userId: r.userId,
            filename: r.filename,
            mimeType: r.mimeType,
            size: r.size,
            createdAt: r.createdAt,
          }))
        );
      };
      req.onerror = () => reject(req.error);
    });
  }
}

export const resumeStorageService: IResumeStorageService = new IndexedDBStorageService();
