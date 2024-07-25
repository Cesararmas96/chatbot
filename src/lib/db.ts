import Dexie from 'dexie';

export const db = new Dexie('ChatDB');

db.version(1).stores({
    users: '++id, &userId, name',
    bots: '++id, &botId, userId',
    messages: '++id, pageId, text, query, answer, chat_history, sid'
});