import { create } from 'zustand';

interface PostState {
    title: string;
    content: string;
    image: string[];
    userId: string;
}