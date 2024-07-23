import Dexie from 'dexie';

const db = new Dexie('chatDatabase');

db.version(1).stores({
    chats: '++id, chatbot_id, user_id, question, response, sid'
});

export const addChat = async (chat) => {
    return await db.chats.add(chat);
};

export const getChat = async (id) => {
    return await db.chats.get(id);
};

export const updateChat = async (id, chat) => {
    await db.chats.update(id, chat);
};

export default db;
