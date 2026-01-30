# JobSeek - Candidate & Recruiter Portal

A comprehensive job portal application featuring a public candidate dashboard and a private recruiter admin panel.

## Features

### Candidate Dashboard (`index.html`)
- **Job Search**: Filter jobs by title, company, or location.
- **Job Listing**: View detailed cards for each job opening.
- **Application System**: Integrated form to submit applications directly to the database.

### Recruiter Admin Panel (`admin.html`)
- **Job Management**: Create new job listings and delete existing ones.
- **Application Tracking**: View list of candidates who applied to specific jobs.
- **Dashboard Stats**: Overview of posted jobs (expandable).

## Database Schema
- `job_listings`: Stores job details (title, company, salary, etc.)
- `job_applications`: Stores applicant data linked to specific jobs via `job_id`.

## Tech Stack
- React 18
- Tailwind CSS
- Lucide Icons
- Trickle Database

## Project Structure
- `index.html`: Candidate entry point.
- `admin.html`: Recruiter entry point.
- `app.js` / `admin-app.js`: Respective logic files.
- `components/`:
    - `ui/`: Shared components (Modal, Alert).
    - `admin/`: Admin-specific components.
- `utils/`: Database helpers.