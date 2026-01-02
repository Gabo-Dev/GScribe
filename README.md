# GScribe

An educational project focused on building a secure, well-architected note system using modern frontend and backend tooling.

---

## 🎉 Project Status

✅ **Version 1.0 (Educational Milestone)**

GScribe has reached its initial educational milestone. All planned objectives related to architecture, security, and domain-driven design have been completed.

This version represents a **stable reference implementation (v1.0)** intended for learning, experimentation, and architectural exploration.

---

## 🎯 Purpose

GScribe is designed as a centralized, private workspace to:

* Outline and track strategic plans (personal or professional)
* Document projects, architectures, and technical learnings
* Capture and organize ideas and notes with strong guarantees around privacy and data ownership

---

## 🧱 Core Tech Stack

* **Language:** TypeScript
* **Frontend:** React + Vite
* **Styling:** Tailwind CSS
* **Backend (BaaS):** Supabase (PostgreSQL, Auth, RLS)
* **Serverless:** Supabase Edge Functions (Deno)
* **Hosting:** Firebase Hosting
* **Security:** hCaptcha (server-side validation)
* **Testing:**

  * Unit / Integration: Vitest
  * End-to-End: Cypress

---

## 🏗️ Project Architecture

GScribe is structured as an **educational reference project** that applies **Hexagonal Architecture (Ports & Adapters)** in a real React + Supabase application.

The goal is not abstraction for its own sake, but to clearly show **where responsibilities live** and **how dependencies flow**.

### Directory Structure

```
root/
├── cypress/               # 🧪 End-to-End Tests
│   ├── e2e/               # Test Scenarios
│   └── support/           # Custom Commands & Config
├── public/                # 📂 Static Assets
├── src/                   # 📦 Application Source Code
│   ├── application/       # ⚙️ Use Cases (orchestrates business logic)
│   ├── core/              # 🧠 Domain & Ports (pure TypeScript)
│   ├── infrastructure/    # 🔌 Adapters & UI (Supabase, React, external services)
│   ├── dependencies.ts    # 💉 Dependency Injection container
│   └── main.tsx           # 🚪 Application entry point (composition root)
├── supabase/              # ⚡ Backend configuration
│   └── functions/         # Edge Functions (e.g. validate-captcha)
└── config files           # Vite, Tailwind, Firebase, CI/CD, etc.
```

### Architectural Responsibilities

* **core/** contains the business language of the system:

  * Domain entities
  * Business rules
  * Port interfaces (contracts)

* **application/** defines *what the system can do*:

  * Use cases that coordinate domain logic
  * No framework or infrastructure dependencies

* **infrastructure/** defines *how things are done*:

  * Supabase adapters (Auth, Notes, Captcha)
  * React UI, hooks, pages
  * External service implementations

All dependencies point **inward**. The domain layer has no knowledge of UI, Supabase, or frameworks.

---

## 🔐 Security & Validation Model

Security is treated as a first-class concern and is enforced consistently across layers.

### Authentication & Data Isolation

* Email/password authentication via Supabase Auth
* Domain-level validation prior to infrastructure calls
* **Row Level Security (RLS)** ensures all data is strictly isolated per authenticated user

### Bot Protection (hCaptcha)

* hCaptcha tokens are validated **server-side** via Supabase Edge Functions
* The client never has access to secret keys

**Environment Variables Strategy**:

* **Frontend (.env)**

  * `VITE_HCAPTCHA_SITE_KEY`
  * `VITE_CAPTCHA_URL`

* **Supabase Secrets**

  * `HCAPTCHA_SECRET_KEY`

---

## 🧩 Implemented Capabilities (v1.0)

### Notes Lifecycle

* Create, read, update, and delete notes
* Optimistic UI with rollback on failure
* Persistent authentication session (no reload flashes)

### Enforced Business Rules

* **Maximum 2 notes per user**

  * Enforced at the UI level (preventive feedback)
  * Enforced at the database level via Supabase RLS (defense in depth)

### User Experience & Feedback

* Global, non-blocking Toast system (success / error / info)
* Clear separation between loading and saving states
* Explicit locked UI states when constraints are violated

### Account & Security Flows

* Secure password update flow with strict validation
* Logout and delete account flows

### Quality & Validation

* Unit tests for infrastructure adapters
* Cypress E2E tests covering critical business constraints
* Strict TypeScript typing across all layers

---

## 📌 Documentation Philosophy

This README is intended to serve as **technical documentation**, not marketing material.

GScribe is an **educational project**, designed to demonstrate how to:

* Structure a frontend application using **Hexagonal Architecture**
* Apply dependency injection explicitly in a React environment
* Enforce business rules coherently across UI, application, and database layers
* Integrate security mechanisms (RLS, server-side captcha validation) by design

The focus is on architectural clarity, correctness, and explicit responsibility boundaries.

---

Built deliberately as a technical learning reference.
