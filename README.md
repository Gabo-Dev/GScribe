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
* **Backend (BaaS):** Supabase (PostgreSQL, Auth, RLS)
* **Hosting:** Firebase Hosting
* **Security:** hCaptcha
* **Testing (Unit/Integration):** Jest + React Testing Library
* **Testing (End-to-End):** Cypress

## 🚀 Project Architecture

This project follows the principles of **Hexagonal Architecture** to separate core logic from external technology.

The `src` directory is structured to reflect this separation:

* **`src/core`**: The heart of the application (pure TypeScript).
    * **`domain`**: Contains the core business models (e.g., `User.ts`, `Project.ts`).
    * **`ports`**: Defines the interfaces for communication (e.g., `IAuthService.ts`).
* **`src/application`**:
    * Contains the application-specific use cases that orchestrate the domain logic (e.g., `CreateNoteUseCase.ts`).
* **`src/infrastructure`**:
    * **`adapters`**: The implementation of the ports using specific technology (e.g., `SupabaseAuthAdapter.ts`). This layer handles all direct interaction with Supabase, including data mapping and error translation.
    * **`ui`**: The React components, hooks, and pages that form the User Interface.

## ✨ Key Features

This project is built with a "security-first" and "robust-demo" approach:

* **Secure RLS Policies:** Utilizes Supabase's Row Level Security to ensure all data (notes, projects) is 100% isolated to the authenticated user.
* **Bot Protection:** Implements **hCaptcha** on the sign-up flow to prevent bot abuse.
* **Guest Demo Mode:** Features an anonymous sign-in ("Guest Button") that provides a full-featured "sandbox" environment for each user, leveraging the same RLS policies for total data isolation.
* **Self-Cleaning Database:** A daily Cron Job automatically purges anonymous guest accounts older than 48 hours to maintain a clean and efficient database.

## Project Status

:construction: **Under Development** :construction:

This project is currently in the initial setup and development phase.