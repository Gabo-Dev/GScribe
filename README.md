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
* **Serverless Logic:** Supabase Edge Functions (Deno)
* **Hosting:** Firebase Hosting
* **Security:** hCaptcha
* **Testing (Unit/Integration):** Jest + React Testing Library
* **Testing (End-to-End):** Cypress

## 🚀 Project Architecture

This project follows the principles of **Hexagonal Architecture** to separate core logic from external technology.

The `src` directory is structured to reflect this separation:

* **`src/core`**: The heart of the application (pure TypeScript).
    * **`domain`**: Contains the core business models (e.g., `User.ts`, `Project.ts`).
    * **`ports`**: Defines the interfaces for communication (e.g., `IAuthService.ts`, `ICaptchaService.ts`).
* **`src/application`**:
    * Contains the application-specific use cases that orchestrate the domain logic (e.g., `CreateNoteUseCase.ts`).
* **`src/infrastructure`**:
    * **`adapters`**: The implementation of the ports using specific technology (e.g., `SupabaseAuthAdapter.ts`, `SupabaseCaptchaAdapter.ts`). This layer handles all direct interaction with external services.
    * **`ui`**: The React components, hooks, and pages that form the User Interface.

## 🏗️ Security & Validation Architecture

We use a **Serverless** approach to validate hCaptcha tokens, ensuring the `HCAPTCHA_SECRET_KEY` is never exposed to the client.

* **Frontend:** React + Vite sends the user token to the Edge Function.
* **Backend:** Supabase Edge Function (Deno) verifies the token with hCaptcha API.

**Environment Variables Strategy:**

* **Public (Frontend - .env):**
    * `VITE_HCAPTCHA_SITE_KEY`: Public key for the widget.
    * `VITE_CAPTCHA_URL`: Endpoint of the deployed Edge Function.
* **Private (Supabase Secrets):**
    * `HCAPTCHA_SECRET_KEY`: Private key (Stored securely via CLI).

## ✨ Key Features

This project is built with a "security-first" and "robust-demo" approach:

* **Secure RLS Policies:** Utilizes Supabase's Row Level Security to ensure all data (notes, projects) is 100% isolated to the authenticated user.
* **Bot Protection:** Implements **hCaptcha** with **server-side validation** to prevent bot abuse and protect database resources.
* **Guest Demo Mode:** Features an anonymous sign-in ("Guest Button") that provides a full-featured "sandbox" environment for each user, leveraging the same RLS policies for total data isolation.
* **Self-Cleaning Database:** A daily Cron Job automatically purges anonymous guest accounts older than 48 hours to maintain a clean and efficient database.

## Project Status

:construction: **Under Development** :construction:

This project is currently in the initial setup and development phase.