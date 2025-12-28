import { useState, useEffect, useCallback } from "react";
import type { Note } from "../../../core/domain/Note.ts";
import { getNotesUseCase, createNoteUseCase, deleteNoteUseCase, updateNoteUseCase } from "../../../di.ts";

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

    const deleteNote = async (id: string) => {
        const previousNotes = [...notes];

        setNotes((prev) => prev.filter((note) => note.id !== id));
        try {
            await deleteNoteUseCase.execute(id);
            return true;
        } catch (error) {
            setNotes(previousNotes);

            const message = error instanceof Error ? error.message : "Error deleting note";
            setError(message);
            return false;
        }
    }

    const updateNote = async (note: Note) => {
        const previousNotes = [...notes];

        setNotes((prev) =>
            prev.map((note) => (note.id === note.id ? note : note))
        );

        try {
            await updateNoteUseCase.execute(note);
            return true;
        } catch (error) {
            setNotes(previousNotes);
            const message = error instanceof Error ? error.message : "Error updating note";
            setError(message);
            return false;
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        isLoading,
        error,
        fetchNotes, 
        addNote,
        deleteNote,
        updateNote
    };
}