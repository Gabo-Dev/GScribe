import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useNotes } from "../hooks/useNotes.ts"; // Importamos nuestro "Controller"
import type { LogOutUseCase } from "../../../application/auth/LogOutUseCase.ts";

interface DashboardPageProps {
    logOutUseCase: LogOutUseCase
}

export function DashboardPage({ logOutUseCase }: DashboardPageProps) {
    const { user, setUser } = useAuth();
    
    // Estado local para UI de Logout
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    
    // Estado local para el Formulario
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Conexión con el Hook de Notas (Controller)
    const { notes, isLoading: isNotesLoading, error: notesError, addNote } = useNotes();

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

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        // Delegamos al hook. Él sabe llamar al UseCase y actualizar el estado.
        const success = await addNote(title, content);

        if (success) {
            setTitle("");
            setContent("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* --- NAVBAR (Sin cambios significativos) --- */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                                <span className="font-bold text-white">G</span>
                            </div>
                            <span className="font-semibold text-lg tracking-tight">GScribe</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 hidden sm:block">
                                {user?.email || 'Guest User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                type="button"
                                disabled={isLogoutLoading}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 disabled:opacity-50"
                            >
                                {isLogoutLoading ? 'Bye...' : 'Sign Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Sección de Error Global */}
                {notesError && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-xl mb-6">
                        Error: {notesError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: Formulario de Creación */}
                    <section className="lg:col-span-1">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-light mb-4 text-sky-400">Nueva Nota</h2>
                            <form onSubmit={handleCreateNote} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Título (ej. Arquitectura Hexagonal)"
                                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none placeholder-gray-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isNotesLoading}
                                />
                                <textarea
                                    placeholder="Escribe tu idea aquí..."
                                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none h-40 resize-none placeholder-gray-500"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isNotesLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isNotesLoading || !title.trim()}
                                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isNotesLoading ? 'Guardando...' : 'Crear Nota'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* COLUMNA DERECHA: Lista de Notas */}
                    <section className="lg:col-span-2">
                        <h2 className="text-xl font-light mb-4 text-gray-300">Mis Notas</h2>
                        
                        {isNotesLoading && notes.length === 0 ? (
                            <div className="text-gray-500 text-center py-10">Cargando notas...</div>
                        ) : notes.length === 0 ? (
                            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-10 text-center text-gray-500">
                                No tienes notas aún. ¡Crea la primera a la izquierda!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map((note) => (
                                    <article key={note.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors group">
                                        <h3 className="font-bold text-lg mb-2 text-gray-100 group-hover:text-sky-400 transition-colors">
                                            {note.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm whitespace-pre-wrap line-clamp-4 mb-4">
                                            {note.content}
                                        </p>
                                        <div className="text-xs text-gray-600 border-t border-gray-700 pt-3 flex justify-between">
                                            <span>{note.createdAt.toLocaleDateString()}</span>
                                            {/* Aquí podríamos poner un botón de borrar en el futuro */}
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