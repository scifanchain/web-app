import { atom } from 'recoil'

// 本地存储
const storage = window.localStorage;
const username = storage.scifanchain_username
const userId = storage.scifanchain_user_id

export const navState = atom({
    key: 'nav',
    default: true,
});

export const usernameState = atom({
    key: 'username',
    default: username,
});

export const userIdState = atom({
    key: 'userId',
    default: userId,
});