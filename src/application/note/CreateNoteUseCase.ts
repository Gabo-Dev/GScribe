import type { INoteRepository } from "../../core/ports/INoteRepository.ts";
import type { Note } from "../../core/domain/Note.ts";

export class CreateNoteUseCase {
    private readonly noteRepository: INoteRepository;
    constructor(noteRepository: INoteRepository)  {
        this.noteRepository = noteRepository;
    }

    async execute(title: string, content: string): Promise<Note> {
        return await this.noteRepository.create({ title, content });
    }
}