import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useNotes } from "../hooks/useNotes.ts"; // Nuestro Controller vitaminado
import type { LogOutUseCase } from "../../../application/auth/LogOutUseCase.ts";
import type { Note } from "../../../core/domain/Note.ts";

interface DashboardPageProps {
    logOutUseCase: LogOutUseCase
}

export function DashboardPage({ logOutUseCase }: DashboardPageProps) {
    const { user, setUser } = useAuth();

    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    

    const [editingNote, setEditingNote] = useState<Note | null>(null);
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const { 
        notes, 
        isLoading: isNotesLoading, 
        error: notesError, 
        addNote, 
        deleteNote, 
        updateNote 
    } = useNotes();


    const handleLogout = async () => {
        setIsLogoutLoading(true);
        try {
            await logOutUseCase.execute();
            setUser(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLogoutLoading(false);
        }
    };

    const handleSaveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        let success = false;

        if (editingNote) {
            success = await updateNote({
                ...editingNote,
                title,
                content
            });
        } else {
            success = await addNote(title, content);
        }

        if (success) {
            resetForm();
        }
    };

    const handleDelete = async (id: string) => {
        if (globalThis.confirm("¿Seguro que quieres eliminar esta nota? Esta acción no se puede deshacer.")) {
            if (editingNote?.id === id) resetForm();
            await deleteNote(id);
        }
    };

    const startEditing = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingNote(null);
        setTitle("");
        setContent("");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-900/20">
                                <span className="font-bold text-white">G</span>
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-gray-100">GScribe</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 hidden sm:block">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                type="button"
                                disabled={isLogoutLoading}
                                className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                            >
                                {isLogoutLoading ? 'Bye...' : 'Sign Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {notesError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{notesError}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    <section className="lg:col-span-1 lg:sticky lg:top-24">
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${
                            editingNote 
                                ? "bg-sky-900/10 border-sky-500/30 shadow-lg shadow-sky-900/20" 
                                : "bg-gray-800/50 border-gray-700" 
                        }`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-xl font-light ${editingNote ? "text-sky-400" : "text-gray-300"}`}>
                                    {editingNote ? "Editar Nota" : "Nueva Nota"}
                                </h2>
                                {editingNote && (
                                    <button 
                                        onClick={resetForm}
                                        type="button"
                                        className="text-xs text-gray-500 hover:text-gray-300 underline"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveNote} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Título (ej. Arquitectura Hexagonal)"
                                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none placeholder-gray-600 transition-all"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isNotesLoading} 
                                />
                                <textarea
                                    placeholder="Escribe tu idea aquí..."
                                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none h-40 resize-none placeholder-gray-600 transition-all"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isNotesLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isNotesLoading || !title.trim()}
                                    className={`font-medium py-2 px-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 ${
                                        editingNote
                                            ? "bg-sky-600 hover:bg-sky-500 text-white"
                                            : "bg-white text-black hover:bg-gray-200"
                                    }`}
                                >
                                    {editingNote ? (
                                        <>
                                            <span>Actualizar Nota</span>
                                        </>
                                    ) : (
                                        isNotesLoading ? 'Guardando...' : 'Crear Nota'
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>

                    <section className="lg:col-span-2 space-y-4">
                        {notes.length === 0 && !isNotesLoading ? (
                            <div className="bg-gray-800/30 border border-gray-700/30 border-dashed rounded-xl p-12 text-center">
                                <p className="text-gray-500">Tu mente está despejada.</p>
                                <p className="text-gray-600 text-sm mt-2">Usa el formulario para capturar una idea.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map((note) => (
                                    <article 
                                        key={note.id} 
                                        className={`group relative bg-gray-800 border rounded-xl p-5 hover:border-gray-600 transition-all duration-200 ${
                                            editingNote?.id === note.id ? "ring-2 ring-sky-500 border-transparent" : "border-gray-700"
                                        }`}
                                    >
                                        {/* CSS TRICK: min-w-0 evita que el flex child desborde el contenedor padre */}
                                        <div className="min-w-0"> 
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                {/* TRUNCATE: Corta el texto con ... si es muy largo */}
                                                <h3 className="font-bold text-lg text-gray-100 truncate w-full" title={note.title}>
                                                    {note.title}
                                                </h3>
                                            </div>
                                            
                                            <p className="text-gray-400 text-sm whitespace-pre-wrap line-clamp-4 wrap-break-word mb-12">
                                                {note.content}
                                            </p>
                                            
                                            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center pt-4 border-t border-gray-700/50">
                                                <span className="text-xs text-gray-600 font-mono">
                                                    {note.createdAt.toLocaleDateString()}
                                                </span>
                                                
                                                <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => startEditing(note)}
                                                        type="button"
                                                        className="p-1.5 text-gray-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-md transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleDelete(note.id)}
                                                        type="button"
                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                                        title="Borrar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}