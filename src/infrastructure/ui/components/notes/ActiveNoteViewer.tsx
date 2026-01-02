import { useState } from "react";
import type { Note } from "../../../../core/domain/Note.ts";

interface Props {
  note: Note | null;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function ActiveNoteViewer({ note, onEdit, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!note) {
    return (
      <div className="h-full w-full bg-[#0A1025]/50 border-2 border-dashed border-sky-900/30 rounded-xl flex flex-col items-center justify-center text-sky-500/50 backdrop-blur-sm p-8 text-center">
        <svg className="w-12 h-12 mb-4 rotate-90 lg:rotate-180 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <p className="font-mono text-lg tracking-widest uppercase text-sky-400/80">Awaiting Data Entry</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0A1025]/80 border-2 border-sky-500/20 rounded-xl flex flex-col backdrop-blur-md shadow-[0_0_50px_rgba(14,165,233,0.05)] overflow-hidden relative group">
      
      <div className="p-5 border-b border-sky-500/20 bg-[#050818]/80 flex justify-between items-start shrink-0 z-20">
        <div className="overflow-hidden">
           <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight wrap-break-word drop-shadow-[0_0_15px_rgba(14,165,233,0.3)] line-clamp-3">
             {note.title}
           </h1>
        </div>
        
        <div className="flex items-center gap-2">
           <button
             onClick={() => onEdit(note)}
             type="button"
             className="p-2 text-sky-400 hover:text-white bg-sky-900/20 hover:bg-sky-500 border border-sky-800 hover:border-sky-400 rounded transition-all"
             title="Edit Note"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
             </svg>
           </button>
           <button
             onClick={() => onDelete(note.id)}
             type="button"
             className="p-2 text-red-500 hover:text-white bg-red-900/10 hover:bg-red-600 border border-red-900/50 hover:border-red-500 rounded transition-all"
             title="Delete Note"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
             </svg>
           </button>
        </div>
      </div>

      <div className="relative grow flex flex-col min-h-0">
        <div 
            className={`w-full p-6 md:p-8 font-sans text-lg leading-relaxed text-blue-100/80 overflow-y-auto custom-scrollbar transition-all duration-500
            ${isExpanded ? "h-full" : "max-h-[60vh]"}`} 
        >
          <div className="whitespace-pre-wrap max-w-none">
            {note.content}
          </div>
          <div className="h-20"></div>
        </div>

        {!isExpanded && (
           <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#020410] via-[#0A1025]/95 to-transparent flex items-end justify-center pb-8 z-10 pointer-events-none">
              <button 
                onClick={() => setIsExpanded(true)}
                type="button"
                className="pointer-events-auto px-6 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/50 hover:border-sky-400 text-sky-400 font-mono text-xs tracking-wider rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]"
              >
                <span>[ EXPAND_DATA_STREAM ]</span>
                <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
           </div>
        )}

        {isExpanded && (
            <div className="absolute bottom-6 right-6 z-20">
               <button 
                onClick={() => setIsExpanded(false)}
                type="button"
                className="p-3 bg-[#0A1025] border border-sky-500/30 text-sky-500 hover:text-white rounded-lg shadow-lg hover:bg-sky-900/50 transition-colors"
                title="Collapse View"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
        )}
      </div>
      
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sky-500/20 rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sky-500/20 rounded-bl-xl pointer-events-none"></div>
    </div>
  );
}