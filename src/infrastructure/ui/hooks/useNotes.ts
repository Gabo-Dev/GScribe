import { useState, useEffect, useCallback } from "react";
import type { Note } from "../../../core/domain/Note.ts";
import { getNotesUseCase, createNoteUseCase } from "../../../di.ts";

export const useNotes = () =>{
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getNotesUseCase.execute();
            setNotes(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);
    const addNote = async (title: string, content: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const newNote = await createNoteUseCase.execute(title, content);
            // Optimistic UI update o recarga:
            setNotes(prev => [newNote, ...prev]); 
            return true; // Indicamos éxito a la vista
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear nota";
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        isLoading,
        error,
        fetchNotes, 
        addNote
    };
}