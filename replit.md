# Overview

This repository contains a React portfolio website showcasing Louis Sergiacomi's professional profile as a B2B Sales & Account Management Expert, along with an embedded B2B AI Sales Toolkit application. The portfolio serves as a professional resume and project showcase, while the sales toolkit demonstrates practical AI implementation for sales processes.

The main portfolio is a single-page application built with React 18, TypeScript, and Vite, featuring responsive design and dark mode support. It includes sections for resume/home, professional portfolio, skills/interests, about, and contact information. The embedded sales toolkit is a Next.js application that provides four AI-powered sales enablement tools for account research, objection handling, ICP scoring, and battlecard generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The portfolio uses a modern React-based architecture with:
- **React 18 + TypeScript**: Type-safe component development with modern React features
- **Vite**: Fast development server and build tool optimized for modern web development
- **React Router DOM v7**: Client-side routing with a Layout wrapper pattern for consistent navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens for consistent theming
- **Framer Motion**: Declarative animations and smooth page transitions
- **Dark Mode Support**: CSS custom properties with localStorage persistence for theme preference

The architecture follows a component-based pattern with clear separation between layout components (Navbar, Footer, MobileBottomNav), UI components (ThemeToggle), and page components. All routes are wrapped in a Layout component to ensure consistent navigation and footer across pages.

## Backend Architecture (Sales Toolkit)

The embedded sales toolkit uses Next.js 14 with App Router:
- **Next.js App Router**: File-based routing with API routes for backend functionality
- **OpenAI-Compatible API Integration**: Flexible LLM client supporting multiple providers (OpenAI, X.AI/Grok)
- **Vector Embeddings**: In-memory vector store using cosine similarity for document retrieval
- **File Processing**: PDF parsing and text extraction for document ingestion
- **JSON-based Persistence**: Local file storage for demo data and user-generated content

The sales toolkit implements four main tools:
1. **AutoBrief**: Account research automation with structured company analysis
2. **Objection KB**: RAG-powered knowledge base for handling sales objections
3. **ICP Scorer**: Ideal Customer Profile scoring with heuristic-based algorithms
4. **Battlecard Builder**: Competitive analysis automation with source citations

## Data Storage Solutions

**Portfolio**: 
- Static data stored in TypeScript files (`src/data/projects.ts`)
- Theme preferences stored in browser localStorage
- No database requirements for the portfolio section

**Sales Toolkit**:
- JSON file-based storage in `/data` directory for demo data and persistence
- Vector embeddings stored as Float32Arrays in JSON format
- File uploads stored in `/uploads` directory
- Sample data provided for demonstrations

## Authentication and Authorization

The applications operate in demo mode without traditional authentication:
- **API Key Management**: Client-side storage of LLM API keys in localStorage
- **No User Accounts**: Stateless operation for demonstration purposes
- **Rate Limiting**: Handled at the LLM provider level
- **Security**: Demo-safe implementation with synthetic data only

## Development and Build Process

**Portfolio**:
- **Package Manager**: Uses npm with package-lock.json for dependency management
- **Build Target**: Static site generation optimized for Netlify deployment
- **Development Server**: Vite dev server with host binding for external access
- **Code Quality**: ESLint with React-specific rules and Prettier for formatting

**Sales Toolkit**:
- **Package Manager**: Uses npm with focus on Node.js 18+ compatibility
- **Build Process**: Next.js build system with TypeScript compilation
- **Development**: Next.js dev server with custom host binding

## Deployment Architecture

**Portfolio**:
- **Netlify Deployment**: Static site hosting with SPA fallback routing
- **Build Command**: TypeScript compilation followed by Vite build to `dist/`
- **Redirects**: Configured for client-side routing support

**Sales Toolkit**:
- **Containerizable**: Standard Next.js application suitable for various hosting platforms
- **Environment Variables**: Configurable LLM endpoints and API keys
- **Static Assets**: Served through Next.js static file handling

# External Dependencies

## Core Frontend Libraries
- **React 18.3.1**: Component library with concurrent features and improved TypeScript support
- **React Router DOM 7.4.0**: Client-side routing with modern data loading patterns
- **Framer Motion 12.5.0**: Animation library for smooth transitions and micro-interactions
- **React Icons 5.5.0**: Comprehensive icon library with consistent styling

## Styling and UI
- **Tailwind CSS 3.4.17**: Utility-first CSS framework with custom configuration
- **tailwindcss-animate 1.0.7**: Pre-built animation utilities for common UI patterns
- **Autoprefixer 10.4.20**: CSS vendor prefix automation for browser compatibility

## Development Tools
- **TypeScript 5.6.2**: Static type checking with strict configuration
- **Vite 6.0.5**: Build tool and development server optimized for modern workflows
- **ESLint 9.18.0**: Code linting with React and TypeScript-specific rules
- **Prettier 3.4.2**: Code formatting with Tailwind CSS class sorting

## LLM and AI Integration
- **OpenAI-Compatible APIs**: Flexible integration supporting OpenAI, X.AI/Grok, and other compatible endpoints
- **PDF Processing**: PDF text extraction capabilities for document ingestion
- **Vector Embeddings**: Text embedding generation for semantic search and retrieval

## Next.js Application Dependencies
- **Next.js 14.2.5**: React framework with App Router for the sales toolkit
- **AJV 8.12.0**: JSON schema validation for API request/response validation
- **pdf-parse 1.1.1**: PDF text extraction library for document processing

## Build and Deployment
- **PostCSS 8.4.38**: CSS processing pipeline for Tailwind CSS compilation
- **Netlify**: Static site hosting with automatic deployment from Git repositories
- **Environment Variables**: Configurable API endpoints and keys for different deployment environments