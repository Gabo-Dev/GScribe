import { SupabaseClient } from "@supabase/supabase-js";
import type { INoteRepository } from "../../core/ports/INoteRepository.ts";
import type { Note } from "../../core/domain/Note.ts";

interface NoteDBResponse {
    id: string;
    title: string;
    content: string;
    createdAt: string; 
}

export class SupabaseNoteAdapter implements INoteRepository {
    private readonly supabase: SupabaseClient;
    constructor(client: SupabaseClient) {
        this.supabase = client;
    }

    async getAll(): Promise<Note[]> {
        const { data, error } = await this.supabase
            .from('notes')
            .select(`
                id,
                title,
                content,
                createdAt:created_at
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        

        const notesData = data as unknown as NoteDBResponse[] | null;

        if (!notesData) return [];

        return notesData.map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            createdAt: new Date(item.createdAt)
        }));
    }

    async create(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
        const { data, error } = await this.supabase
            .from('notes')
            .insert({
                title: note.title,
                content: note.content
            })
            .select(`
                id,
                title,
                content,
                createdAt:created_at
            `)
            .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Creation failed");

        const newNote = data as unknown as NoteDBResponse;

        return {
            id: newNote.id,
            title: newNote.title,
            content: newNote.content,
            createdAt: new Date(newNote.createdAt)
        };
    }
}