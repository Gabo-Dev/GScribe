import type { INoteRepository } from "../../core/ports/INoteRepository.ts";

export class DeleteNoteUseCase {
    private readonly noteRepository: INoteRepository
    constructor(noteRepository: INoteRepository)  {
        this.noteRepository = noteRepository;
    }

    async execute(id: string): Promise<void> {
        return await this.noteRepository.delete(id);
    }
}