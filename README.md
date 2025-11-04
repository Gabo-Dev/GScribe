# GScribe

A personal hub for organizing projects, plans, and ideas in one clean, private space.

## Purpose

This tool is being built to serve as a centralized workspace. The objective is to create a dedicated space to:

* Outline and track strategic plans (both personal and professional).
* Document projects, architectures, and learnings.
* Quickly capture and organize ideas, notes, and knowledge.

## Core Tech Stack

* **Core Language:** TypeScript
* **Framework:** React
* **Bundler/Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Backend (BaaS):** Supabase (PostgreSQL, Auth)
* **Hosting:** Firebase Hosting
* **Testing (Unit/Integration):** Jest + React Testing Library
* **Testing (End-to-End):** Cypress

## 🚀 Project Architecture

This project follows the principles of **Hexagonal Architecture** to separate core logic from external technology.

The `src` directory is structured to reflect this separation:

* **`src/core`**: The heart of the application (pure TypeScript, no React/Supabase).
    * **`domain`**: Contains the core business models (e.g., `User.ts`, `Project.ts`, `Note.ts`).
    * **`ports`**: Defines the interfaces for communication with the outside world (e.g., `IAuthService.ts`, `IProjectRepository.ts`).
* **`src/application`**:
    * Contains the application-specific use cases that orchestrate the domain logic (e.g., `CreateNoteUseCase.ts`, `GetUserProjectsUseCase.ts`).
* **`src/infrastructure`**:
    * **`adapters`**: The implementation of the ports using specific technology (e.g., `SupabaseAuthAdapter.ts`, `SupabaseNoteRepository.ts`).
    * **`ui`**: The React components, hooks, and pages that form the User Interface (e.g., `App.tsx`, `pages/Dashboard.tsx`).

## Project Status

:construction: **Under Development** :construction:

This project is currently in the initial setup and development phase.