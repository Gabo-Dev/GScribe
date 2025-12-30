import type { INoteRepository } from "../../core/ports/INoteRepository.ts";
import type { Note } from "../../core/domain/Note.ts";

export class UpdateNoteUseCase {
  private readonly noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(note: Note): Promise<Note> {
    if(!note.id) throw new Error("Cannot update note without ID");
    if(!note.title) throw new Error("Title is required");
    return await this.noteRepository.update(note);
  }
}
