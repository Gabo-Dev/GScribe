import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuthAdapter } from './SupabaseAuthAdapter.ts';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ICaptchaService } from '../../core/ports/ICaptchaService.ts';

// -----------------------------------------------------------------------------
// 1. MOCKS SETUP
// We mock external dependencies to test the Adapter logic in isolation.
// -----------------------------------------------------------------------------

// Spies: Functions that record how they are called
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockCaptchaVerify = vi.fn();

// Partial Mock of Supabase Client
// We cast to 'unknown' first to bypass strict typing of the full Supabase Client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signOut: mockSignOut,
  },
} as unknown as SupabaseClient;

// Mock of the Captcha Service
const mockCaptchaService: ICaptchaService = {
  verify: mockCaptchaVerify,
};

// -----------------------------------------------------------------------------
// 2. TEST SUITE
// -----------------------------------------------------------------------------
describe('SupabaseAuthAdapter', () => {
  let adapter: SupabaseAuthAdapter;

  // Reset state before each test to ensure independence
  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new SupabaseAuthAdapter(mockSupabaseClient, mockCaptchaService);
  });

  describe('signIn', () => {
    
    // --- HAPPY PATH ---
    it('should correctly map Supabase response to a Domain User entity', async () => {
      // 1. ARRANGE: Prepare the mock response
      const inputEmail = 'user@example.com';
      const inputPassword = 'Password123!';
      
      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: 'user-uuid-123',
            email: inputEmail,
            user_metadata: { alias: 'TestAlias' },
          },
        },
        error: null,
      });

      // 2. ACT: Execute the method under test
      const result = await adapter.signIn(inputEmail, inputPassword);

      // 3. ASSERT: Verify the call arguments and the return value
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: inputEmail,
        password: inputPassword,
      });

      expect(result).toEqual({
        id: 'user-uuid-123',
        email: inputEmail,
        alias: 'TestAlias',
      });
    });

    // --- ERROR HANDLING ---
    it('should catch infrastructure errors and throw domain-specific errors', async () => {
      // 1. ARRANGE: Simulate a Supabase error (e.g., wrong password)
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid login credentials'),
      });

      // 2 & 3. ACT & ASSERT: Expect the promise to reject with a translated message
      await expect(adapter.signIn('wrong@email.com', 'badpass'))
        .rejects
        .toThrow('Incorrect email or password.');
    });

    // --- DATA INTEGRITY / TYPE SAFETY ---
    it('should throw an error if the returned user is missing mandatory fields (Email)', async () => {
      // 1. ARRANGE: Simulate an inconsistent state (User exists but Email is undefined)
      // This tests the Guard Clauses implemented in the adapter.
      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: 'user-uuid-123',
            email: undefined, // Critical failure simulation
            user_metadata: { alias: 'GhostUser' },
          },
        },
        error: null,
      });

      // 2 & 3. ACT & ASSERT
      await expect(adapter.signIn('test@test.com', 'pass'))
        .rejects
        .toThrow('No email returned.');
    });
  });
});