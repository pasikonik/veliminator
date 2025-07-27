# Replit.md

## Overview

This is a full-stack life values sorting application built with a React frontend and Express.js backend. The application allows users to sort and prioritize their life values using drag-and-drop functionality, with features for CSV import/export and comprehensive keyboard navigation. The project uses TypeScript throughout, Tailwind CSS with shadcn/ui components for styling, and includes a database layer prepared for PostgreSQL with Drizzle ORM.

## Recent Changes (July 27, 2025)

- Enhanced keyboard navigation: Left arrow moves item up, right arrow moves item down
- Added Delete/Backspace key support for removing items from sorted list
- Implemented subtle yellow background highlighting for top 7 values
- Significantly improved UI compactness: smaller padding, reduced card sizes, 4-column grid for unsorted values
- Compact header and instructions panel for maximum screen utilization
- Added tooltips to movement buttons for better UX
- Updated instructions panel to reflect new keyboard controls
- **Added comprehensive mobile support**: responsive layouts, touch-friendly buttons, mobile-specific instructions
- Optimized interface for mobile devices with larger touch targets and simplified navigation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React SPA with Vite build system
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM (currently using in-memory storage)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, local state for UI

## Key Components

### Frontend Structure
- **Components**: Modular React components using shadcn/ui
- **Pages**: Single main page for values sorting
- **Hooks**: Custom hooks for keyboard navigation, mobile detection, and values management
- **Libraries**: CSV utilities, query client, and utility functions

### Backend Structure
- **Server**: Express.js with middleware for logging and error handling
- **Storage**: Interface-based storage system with in-memory implementation
- **Routes**: Placeholder for REST API endpoints
- **Vite Integration**: Development server setup with HMR

### Shared Resources
- **Schema**: Zod schemas for data validation and TypeScript types
- **Types**: Life values data structures and CSV export formats

## Data Flow

1. **Client-Side State**: Values are stored in localStorage and managed through custom hooks
2. **UI Interactions**: Drag-and-drop operations update local state immediately
3. **Auto-Save**: Changes are automatically persisted to localStorage
4. **CSV Operations**: Import/export functionality for external data exchange
5. **Future API Integration**: Backend storage interface ready for database operations

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with modern hooks
- **Express.js**: Backend web framework
- **TypeScript**: Type safety across the stack
- **Vite**: Build tool and development server

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Radix UI**: Accessible UI primitives

### Data Management
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Schema validation
- **TanStack Query**: Server state management
- **PapaParse**: CSV parsing library

### Development Tools
- **Replit Plugins**: Development environment integration
- **PostCSS**: CSS processing
- **ESBuild**: JavaScript bundling

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with middleware for API logging
- In-memory storage for rapid prototyping

### Production Build
- Vite builds frontend to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Environment variables for database configuration

### Database Setup
- Drizzle configuration points to PostgreSQL
- Migration files stored in `./migrations`
- Schema defined in `shared/schema.ts` (currently contains life values types)
- Environment variable `DATABASE_URL` required for database connection

### Key Scripts
- `dev`: Start development server
- `build`: Build both frontend and backend for production
- `start`: Run production server
- `db:push`: Push database schema changes

The application is structured to easily transition from the current in-memory storage to a full PostgreSQL database by implementing the storage interface methods and adding appropriate API routes.