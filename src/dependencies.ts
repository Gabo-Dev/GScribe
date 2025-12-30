import { createClient } from "@supabase/supabase-js";

import { SupabaseAuthAdapter } from "./infrastructure/adapters/SupabaseAuthAdapter.ts";
import { SupabaseCaptchaAdapter } from "./infrastructure/adapters/SupabaseCaptchaAdapter.ts";
import { SupabaseNoteAdapter } from "./infrastructure/adapters/SupabaseNoteAdapter.ts";

// Auth
import { SendPasswordResetEmailUseCase } from "./application/auth/SendPasswordResetEmailUseCase.ts";
import { UpdatePasswordUseCase } from "./application/auth/UpdatePasswordUseCase.ts";
// Notes
import { GetNotesUseCase } from "./application/note/GetNotesCase.ts"; 
import { CreateNoteUseCase } from "./application/note/CreateNoteUseCase.ts"; 
import { DeleteNoteUseCase } from "./application/note/DeleteNoteUseCase.ts"; 
import { UpdateNoteUseCase } from "./application/note/UpdateNoteUseCase.ts"; 

// --- 3. Configuración (Variables de Entorno) ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const captchaFunctionUrl = import.meta.env.VITE_CAPTCHA_URL; 

if (!supabaseUrl || !supabaseKey || !captchaFunctionUrl) {
  console.error("Faltan variables de entorno críticas en dependencies.ts");
}

// --- 4. Cliente Externo (Singleton) ---
export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// --- 5. Instanciación de Adaptadores (Infraestructura) ---

// 5.1 Servicios Base (Sin dependencias de otros repositorios)
const captchaService = new SupabaseCaptchaAdapter(captchaFunctionUrl, supabaseKey);

// 5.2 Servicios Compuestos (Dependen de base o cliente)
const authRepository = new SupabaseAuthAdapter(supabaseClient, captchaService);
const noteRepository = new SupabaseNoteAdapter(supabaseClient);

// --- 6. Instanciación de Casos de Uso (Aplicación) ---

// Auth
export const sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(authRepository);
export const updatePasswordUseCase = new UpdatePasswordUseCase(authRepository);

// Notes
export const getNotesUseCase = new GetNotesUseCase(noteRepository);
export const createNoteUseCase = new CreateNoteUseCase(noteRepository);
export const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);
export const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);