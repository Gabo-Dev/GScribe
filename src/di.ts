import { createClient } from "@supabase/supabase-js";
import { SupabaseNoteAdapter } from "./infrastructure/adapters/SupabaseNoteAdapter.ts";
import { GetNotesUseCase } from "./application/note/GetNotesCase.tsx";
import { CreateNoteUseCase } from "./application/note/CreateNoteUseCase.tsx";

// 1. Configuración (Variables de entorno)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// 2. Cliente Externo (Singleton)
export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// 3. Adaptadores (Infraestructura)
const noteRepository = new SupabaseNoteAdapter(supabaseClient);

// 4. Casos de Uso (Aplicación)
// Exportamos las instancias ya listas para usar
export const getNotesUseCase = new GetNotesUseCase(noteRepository);
export const createNoteUseCase = new CreateNoteUseCase(noteRepository);