import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useNotes } from "../hooks/useNotes.ts";
import { useToast } from "../hooks/useToast.ts";
import { useDeleteAccount } from "../hooks/useDeleteAccount.ts";
import type { LogOutUseCase } from "../../../application/auth/LogOutUseCase.ts";
import type { DeleteAccountUseCase } from "../../../application/auth/DeleteAccountUseCase.ts";
import type { Note } from "../../../core/domain/Note.ts";

import { Navbar } from "../components/Navbar.tsx";
import { NoteForm } from "../components/notes/NoteForm.tsx";
import { ActiveNoteViewer } from "../components/notes/ActiveNoteViewer.tsx";
import { NotesCarousel } from "../components/notes/NotesCarousel.tsx";
import { LegalNoticeModal } from "../components/modals/LegalNoticeModal.tsx";
import { DeleteAccountModal } from "../components/modals/DeleteAccountModal.tsx";
import { DeleteNoteModal } from "../components/modals/DeleteNoteModal.tsx";

interface DashboardPageProps {
  logOutUseCase: LogOutUseCase;
  deleteAccountUseCase: DeleteAccountUseCase;
}

export function DashboardPage({ logOutUseCase }: DashboardPageProps) {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const {
    isDeleting,
    handleDeleteAccount,
    success: deleteSuccess,
    error: deleteError,
  } = useDeleteAccount();

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isDeletingAccountModalOpen, setIsDeletingAccountModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const {
    notes,
    isNotesLoading,
    isSaving,
    error: notesError,
    addNote,
    deleteNote,
    updateNote,
  } = useNotes();

  useEffect(() => {
    if (deleteSuccess) {
      setUser(null);
      showToast("Account deleted successfully", "success");
      setIsDeletingAccountModalOpen(false);
    }
    if (deleteError) {
      showToast(deleteError, "error");
    }
  }, [deleteSuccess, deleteError, setUser, showToast]);

  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

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
      success = await updateNote({ ...editingNote, title, content });
      if (success) showToast("Note updated successfully", "success");
    } else {
      success = await addNote(title, content);
      if (success) showToast("Note created successfully", "success");
    }

    if (success) resetForm();
  };

  const requestDeleteNote = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    if (editingNote?.id === noteToDelete) resetForm();
    if (activeNoteId === noteToDelete) setActiveNoteId(null);

    const success = await deleteNote(noteToDelete);

    if (success) {
      showToast("Note deleted", "info");
    }
    setNoteToDelete(null);
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const savedActiveNote = notes.find((note) => note.id === activeNoteId) || null;
  
  const displayNote = (editingNote?.id === activeNoteId && savedActiveNote)
    ? { ...savedActiveNote, title: title, content: content, updatedAt: new Date() }
    : savedActiveNote;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#020410] text-blue-50 font-sans selection:bg-sky-500/30">
      <Navbar
        userEmail={user?.email}
        isLogoutLoading={isLogoutLoading}
        isDeleteAccountLoading={isDeleting}
        onLogout={handleLogout}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        onDeleteAccount={() => setIsDeletingAccountModalOpen(true)}
      />

      <main className="flex-1 flex flex-col min-h-0 w-full relative">
        {notesError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <span>{notesError}</span>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 py-6 min-h-0">
          <div className="lg:col-span-5 h-full flex flex-col justify-center overflow-y-auto pr-2">
            <NoteForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              isLoading={isNotesLoading}
              isSaving={isSaving}
              editingNote={editingNote}
              onCancel={resetForm}
              onSubmit={handleSaveNote}
            />
          </div>

          <div className="lg:col-span-7 h-full relative min-h-0">
            <ActiveNoteViewer
              note={displayNote}
              onEdit={startEditing}
              onDelete={requestDeleteNote}
            />
          </div>
        </div>

        <div className="shrink-0 w-full px-6 pb-3 hidden md:flex flex-col gap-3">
          
          <div className="flex items-center gap-3 select-none">
             <div className="flex items-center gap-2 text-sky-500/80">
                <span className="text-lg">›</span>
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-sky-500/20 drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]">
                  // MY_NOTES_ARCHIVE
                </h3>
             </div>
             <div className="h-px flex-1 bg-linear-to-r from-sky-900/50 to-transparent"></div>
             <span className="text-[10px] font-mono text-gray-600">
                TOTAL_ENTRIES: {notes.length}
             </span>
          </div>

          <div className="h-28 w-full">
            <NotesCarousel 
              notes={notes}
              activeNoteId={activeNoteId}
              onSelect={setActiveNoteId}
            />
          </div>
        </div>
      </main>

      <LegalNoticeModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeletingAccountModalOpen}
        onClose={() => setIsDeletingAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
      <DeleteNoteModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDeleteNote}
      />
    </div>
  );
}