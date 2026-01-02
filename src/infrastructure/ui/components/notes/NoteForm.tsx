import type { Note } from "../../../../core/domain/Note.ts";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  isLoading: boolean;
  isSaving: boolean;
  editingNote: Note | null;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLimitedReached: boolean;
}

export function NoteForm({
  title,
  setTitle,
  content,
  setContent,
  isLoading,
  isSaving,
  editingNote,
  onCancel,
  onSubmit,
  isLimitedReached,
}: Props) {
  const isLocked = isLimitedReached || isSaving || isLoading;

  return (
    <div
      className={`relative w-full border-2 rounded-xl p-6 transition-all duration-300 overflow-hidden flex flex-col gap-6
        ${
          editingNote
            ? "bg-sky-900/20 border-sky-400/50 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
            : isLocked
            ? "bg-red-900/10 border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
            : "bg-[#0A1025]/90 border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
        } backdrop-blur-xl`}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6 h-full">
        <div className="flex justify-between items-center border-b border-sky-500/20 pb-2 shrink-0">
          <h2
            className={`text-xl font-mono font-bold tracking-wider uppercase drop-shadow-[0_0_5px_rgba(14,165,233,0.5)] flex items-center gap-2 ${
              editingNote
                ? "text-sky-300"
                : isLocked
                ? "text-red-400"
                : "text-sky-400"
            }`}
          >
            <span className="text-2xl">
              {editingNote ? "›" : isLocked ? "×" : "+"}
            </span>
            <span>
              {editingNote
                ? "MODIFY_DATA"
                : isLocked
                ? "MEMORY_FULL"
                : "INPUT_NEW"}
            </span>
          </h2>

          <div className="flex items-center gap-3">
            {editingNote && (
              <button
                onClick={onCancel}
                type="button"
                className="text-xs font-mono text-red-400 hover:text-red-300 tracking-widest border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10 transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                title="Cancel Operation"
              >
                [ABORT]
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !title.trim() || isSaving || isLocked}
              className={`text-xs font-mono tracking-widest border px-3 py-1 rounded transition-all flex items-center gap-2
                ${
                  isLoading || !title.trim() || isLocked
                    ? "text-gray-500 border-gray-700 cursor-not-allowed opacity-50"
                    : "text-sky-400 hover:text-sky-200 border-sky-500/50 hover:border-sky-400 hover:bg-sky-500/10 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] active:scale-95" // Estado activo
                }`}
              title="Execute Save Protocol"
            >
              {isLocked ? (
                <span>[ LOCKED ]</span>
              ) : isSaving ? (
                <>
                  <span className="animate-spin h-2 w-2 border-2 border-current border-t-transparent rounded-full"></span>
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>[{editingNote ? "UPDATE" : "SAVE"}]</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 space-y-4">
            <svg
              className="w-16 h-16 text-red-500/50 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="space-y-1">
              <p className="text-red-400 font-mono text-sm tracking-widest">
                STORAGE_LIMIT_EXCEEDED
              </p>
              <p className="text-gray-500 text-xs max-w-xs mx-auto">
                Standard Protocol allows strictly 2 data entries. Delete an
                older entry to free up memory sectors.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 shrink-0">
              <div className="flex justify-between items-end px-1">
                <label className="text-xs font-mono text-sky-500/70 uppercase tracking-widest">
                  Title_Header
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    title.length >= 60
                      ? "text-red-400 animate-pulse"
                      : "text-sky-500/30"
                  }`}
                >
                  {title.length}/60 CHARS
                </span>
              </div>

              <input
                type="text"
                placeholder="Ex: MISSION_PROTOCOL_V1"
                maxLength={60}
                className="w-full bg-[#050818]/50 border border-sky-900/50 rounded-lg p-3 text-sky-100 font-mono focus:border-sky-400 focus:bg-[#050818] focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] outline-none placeholder-sky-800/50 transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <label className="text-xs font-mono text-sky-500/70 uppercase tracking-widest px-1 shrink-0">
                Data_Content
              </label>
              <textarea
                placeholder="ENTER DATA STREAM..."
                className="w-full flex-1 bg-[#050818]/50 border border-sky-900/50 rounded-lg p-3 text-sky-100 font-mono focus:border-sky-400 focus:bg-[#050818] focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] outline-none resize-none placeholder-sky-800/50 transition-all duration-200 scrollbar-thin scrollbar-thumb-sky-900 scrollbar-track-[#050818] min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </>
        )}
      </form>
    </div>
  );
}
