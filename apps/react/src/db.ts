import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  password: string;
}

export class MyDatabase extends Dexie {
  users!: Table<User>;

  constructor() {
    super('CareConnectDB');
    this.version(1).stores({
      users: '++id, &username' // The '&' ensures usernames are unique
    });
  }
}

export const db = new MyDatabase();

// This "populates" the database the very first time it's created
db.on('populate', () => {
  db.users.add({
    username: 'admin@careconnect.com',
    password: 'password123'
  });
});