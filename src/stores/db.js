// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  purchase: '++id, code, detail', // Primary key and indexed props
  bank: '++id, cusCode, bankName, branch, accountNumber, bankOwner',
});