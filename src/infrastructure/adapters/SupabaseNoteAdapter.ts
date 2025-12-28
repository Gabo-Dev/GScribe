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

    private mapToDomain(item: NoteDBResponse): Note {
        return {
            id: item.id,
            title: item.title,
            content: item.content,
            createdAt: new Date(item.createdAt)
        };
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

        return notesData.map((item) => this.mapToDomain(item));
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

        return this.mapToDomain(newNote);
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async update(note: Note): Promise<Note> {
        const { data, error } = await this.supabase
            .from('notes')
            .update({
                title: note.title,
                content: note.content
            })
            .eq('id', note.id)
            .select(`
                id,
                title,
                content,
                createdAt:created_at
            `)
            .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Update failed");

        const updatedNote = data as unknown as NoteDBResponse;

        return this.mapToDomain(updatedNote);
    }

}