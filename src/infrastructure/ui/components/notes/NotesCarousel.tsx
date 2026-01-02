import type { Note } from "../../../../core/domain/Note.ts";
interface Props {
  notes: Note[];
  activeNoteId: string | null;
  onSelect: (id: string) => void;
}

export function NotesCarousel({ notes, activeNoteId, onSelect }: Props) {
  if (notes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-800 rounded-xl bg-[#0A1025]/30">
        <span className="text-xs font-mono text-gray-600 uppercase tracking-wider animate-pulse">
          [ NO_DATA_AVAILABLE ]
        </span>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex justify-center gap-6 overflow-x-auto pb-2 custom-scrollbar snap-x touch-pan-x px-1">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note.id)}
          type="button"
          className={`shrink-0 w-lg h-full text-left p-4 rounded-xl border transition-all duration-300 snap-start group relative overflow-hidden flex flex-col justify-between
            ${
              activeNoteId === note.id
                ? "bg-sky-900/20 border-sky-500 "
                : "bg-[#0A1025]/80 border-gray-800 hover:border-gray-600 hover:bg-[#0A1025]"
            }`}
        >
          <div 
            className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 
            ${activeNoteId === note.id ? 'bg-sky-500' : 'bg-transparent group-hover:bg-gray-800'}`}
          ></div>

          <div className="pl-3 w-full">
            <h4 
              className={`font-mono font-bold text-base mb-2 transition-colors wrap-break-word line-clamp-1
              ${activeNoteId === note.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
              title={note.title}
            >
              {note.title}
            </h4>
 
          </div>

          <div className="flex justify-between items-end mt-2 pl-3 border-t border-gray-800/50 pt-3 w-full">
            <span className="text-[10px] text-gray-500 font-mono">
              {note.createdAt.toLocaleDateString()}
            </span>
            
            {activeNoteId === note.id && (
              <div className="flex items-center gap-2 shrink-0 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_5px_#0ea5e9]"></span>
                <span className="text-[9px] text-sky-300 font-mono uppercase tracking-wider">READING</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}