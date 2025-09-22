import Dexie from 'dexie';

export interface User {
  id?: number;
  role: 'job' | 'candidate';
  email: string;
  password: string;
}

export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  users: '++id,email,role,password',
});
