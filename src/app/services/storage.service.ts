import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BucketItem } from '../models/bucket-item.model';

interface BucketDB extends DBSchema {
  items: {
    key: string;
    value: BucketItem;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBPDatabase<BucketDB> | null = null;

  async initDB() {
    if (!this.db) {
      this.db = await openDB<BucketDB>('BucketDB', 1, {
        upgrade(db) {
          db.createObjectStore('items', { keyPath: 'id' });
        },
      });
    }
    return this.db;
  }

  async addItem(item: Omit<BucketItem, 'id' | 'createdAt' | 'order'>): Promise<BucketItem> {
    const db = await this.initDB();
    const allItems = await this.getAllItems();
    const newItem: BucketItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      order: allItems.length
    };
    await db.add('items', newItem);
    return newItem;
  }

  async getAllItems(): Promise<BucketItem[]> {
    const db = await this.initDB();
    const items = await db.getAll('items');
    return items.sort((a, b) => a.order - b.order);
  }

  async deleteItem(id: string): Promise<void> {
    const db = await this.initDB();
    await db.delete('items', id);
  }

  async updateItemOrder(items: BucketItem[]): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('items', 'readwrite');
    items.forEach((item, index) => {
      item.order = index;
      tx.store.put(item);
    });
    await tx.done;
  }

  async clearAll(): Promise<void> {
    const db = await this.initDB();
    await db.clear('items');
  }

  async exportData(): Promise<string> {
    const items = await this.getAllItems();
    return JSON.stringify({
      items,
      exportedAt: new Date()
    }, null, 2);
  }
}