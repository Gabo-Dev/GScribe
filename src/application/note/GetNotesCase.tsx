import type { INoteRepository } from "../../core/ports/INoteRepository.ts";
import type { Note } from "../../core/domain/Note.ts";

export class GetNotesUseCase {
    private readonly noteRepository: INoteRepository
    constructor(noteRepository: INoteRepository)  {
        this.noteRepository = noteRepository;
    }

    async execute(): Promise<Note[]> {
        return await this.noteRepository.getAll();
    }
}