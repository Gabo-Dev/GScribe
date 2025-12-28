import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseNoteAdapter } from './SupabaseNoteAdapter.ts';
import type { SupabaseClient } from '@supabase/supabase-js';

const mockPostgrestBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
};

const mockSupabaseClient = {
    from: vi.fn(() => mockPostgrestBuilder), // returns the mockPostgrestBuilder when from() is called
    auth: {
        getUser: vi.fn(),
    }
}as unknown as SupabaseClient;

describe('SupabaseNoteAdapter', () => {
    let adapter: SupabaseNoteAdapter;

    // Reset state before each test to ensure independence
    beforeEach(() => {
        vi.clearAllMocks();
        adapter = new SupabaseNoteAdapter(mockSupabaseClient);
    });

    describe('getAll', () => {
        it('should return a list of mapped notes when DB returns data', async () => {
            const mockDbResponse = [
                { id: '1', title: 'Note 1', content: 'Content 1', createdAt: '2023-01-01T10:00:00Z' },
                { id: '2', title: 'Note 2', content: 'Content 2', createdAt: '2023-01-02T10:00:00Z' }
            ];

            mockPostgrestBuilder.order.mockResolvedValueOnce({
                data: mockDbResponse,
                error: null
            });

            const result = await adapter.getAll();

            expect(mockSupabaseClient.from).toHaveBeenCalledWith('notes');
            expect(mockPostgrestBuilder.select).toHaveBeenCalledWith(expect.stringContaining('createdAt:created_at'));

            expect(result).toHaveLength(2);
            expect(result[0].createdAt).toBeInstanceOf(Date);
            expect(result[0].title).toBe('Note 1');
        });

        it('should throw an error if Supabase fails', async () => {
            mockPostgrestBuilder.order.mockResolvedValueOnce({
                data: null,
                error: { message: 'Connection timeout' }
            });

            await expect(adapter.getAll()).rejects.toThrow('Connection timeout');
        });
    });

    describe('create', () => {
        it('should insert data and return the mapped note', async () => {
            const newNoteInput = { title: 'New Idea', content: 'Testing is cool' };
            const mockDbResponse = { 
                id: '123', 
                title: 'New Idea', 
                content: 'Testing is cool', 
                createdAt: '2023-12-01T00:00:00Z' 
            };


            mockPostgrestBuilder.single.mockResolvedValueOnce({
                data: mockDbResponse,
                error: null
            });
            

            const result = await adapter.create(newNoteInput);

            expect(mockPostgrestBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Idea',
                content: 'Testing is cool'
            }));

            expect(result.id).toBe('123');
            expect(result.createdAt).toBeInstanceOf(Date);
        });
    });

    describe('delete', () =>{
        it('should delete a note by id', async () => {
            mockPostgrestBuilder.delete.mockReturnThis();
            mockPostgrestBuilder.eq.mockResolvedValueOnce({error: null});

            await adapter.delete('123');

            expect(mockPostgrestBuilder.delete).toHaveBeenCalledWith();
            expect(mockPostgrestBuilder.eq).toHaveBeenCalledWith('id', '123');
        });
    });

    describe('update', () => {
        it('should update a note and return the new version', async () => {
            const noteToUpdate = { 
                id: '123', 
                title: 'Updated Title', 
                content: 'Updated Content', 
                createdAt: new Date() 
            };

            const mockDbResponse = { 
                id: '123', 
                title: 'Updated Title', 
                content: 'Updated Content', 
                createdAt: '2023-01-01T10:00:00Z' 
            };

            mockPostgrestBuilder.update.mockReturnThis();
            mockPostgrestBuilder.eq.mockReturnThis();
            mockPostgrestBuilder.select.mockReturnThis();
            mockPostgrestBuilder.single.mockResolvedValueOnce({ data: mockDbResponse, error: null });

            const result = await adapter.update(noteToUpdate);

            expect(mockPostgrestBuilder.update).toHaveBeenCalledWith({
                title: 'Updated Title',
                content: 'Updated Content'
            });
            expect(result.title).toBe('Updated Title');
        });
        
    });
});
