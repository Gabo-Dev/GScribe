import type { Note } from "../domain/Note.ts";

export interface INoteRepository {
    create(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note>; 
    getAll(): Promise<Note[]>;
}