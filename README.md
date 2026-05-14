# Enfec AI Interview Platform UI

A frontend-only AI-based interview platform built with Next.js. The project demonstrates a complete candidate interview journey with polished light-theme UI, form validation, setup checks, protected interview flow, coding challenge UI, and final interview summary.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide React icons
- LocalStorage for demo session persistence

## Main Flow

1. Landing / Welcome screen
2. Candidate details form
3. Interview setup and device checks
4. AI interview screen
5. Coding challenge screen
6. Interview summary screen

## Screens Implemented

### Landing Screen

- Enfec logo branding
- AI interview platform description
- Start Interview call-to-action
- Interview instructions
- Estimated duration: 45 minutes
- Responsive professional layout
- Hover and focus states

### Candidate Details

Fields included:

- Full name
- Email address
- Role applied for
- Experience level
- Skills / technologies
- Resume upload UI

Behavior:

- On-change validation
- Submit validation
- Error states
- Focus states
- Form autosaves to `localStorage`
- Going back from setup restores the entered data

### Interview Setup

Includes:

- Camera access check
- Microphone access check
- Internet status check
- Interview guidelines
- Start Interview button
- Retry permission button
- Temporary `Continue Without Devices` option for systems without camera/mic

Important note:

The camera and microphone check uses `navigator.mediaDevices.getUserMedia`. If the system has no device or permission is blocked, use `Continue Without Devices` to test the remaining flow.

### Route Protection

The app protects the interview flow using client-side localStorage checks:

- `/interview-setup` redirects to `/candidate-details` if candidate details are missing.
- `/interview` redirects to `/candidate-details` if candidate details are missing.
- `/interview` redirects to `/interview-setup` if setup is not completed.

This is frontend-only protection for the assignment demo. A production app should enforce this on the server.

### AI Interview Screen

Includes:

- AI interviewer panel
- Candidate video preview placeholder
- Current question display
- Timer
- Start Answer button
- Record button
- Submit Answer button
- Skip Question button
- End Interview confirmation modal
- Progress indicator
- Transcript panel
- Voice waveform animation
- AI typing animation
- Disabled and error states

### Coding Challenge

Includes:

- Problem statement
- Constraints
- Input/output examples
- Language selector
- Monospace code editor
- Run Code button
- Submit Code button
- Copy code button
- Output console

The code runner is simulated for frontend demonstration.

### Interview Summary

Includes:

- Candidate name
- Role applied for
- Completion status
- Questions attempted
- Time taken
- Performance score placeholder
- Strengths section
- Areas for improvement
- Transcript preview
- Download report action
- Share results action
- Back to Home action

When the user clicks `Back to Home`, the app clears the interview session from localStorage so another candidate can start fresh.

## LocalStorage Keys Used

- `candidateDraft`
- `candidateData`
- `interviewSetupComplete`
- `deviceCheckBypassed`
- `interviewData`
- `codingData`

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build and Verification

Run lint:

```bash
npm run lint
```

Run TypeScript check:

```bash
node_modules\.bin\tsc.cmd --noEmit
```

Create production build:

```bash
npm run build
```

## Routes

- `/` - Landing screen
- `/candidate-details` - Candidate form
- `/interview-setup` - Device and guideline setup
- `/interview` - AI interview UI
- `/coding-question` - Coding challenge UI
- `/interview-summary` - Final summary

## Current Limitations

This is a frontend assessment project, so some functionality is intentionally mocked:

- No real AI backend
- No real answer evaluation
- No real video recording
- No real code execution sandbox
- Device checks rely on browser permission APIs
- Route protection is client-side only

## Production Improvements

For a production SaaS application, the next improvements would be:

- Server-side authentication and route protection
- Real candidate/session API
- Real media recording and upload
- Real AI evaluation service
- Real code runner sandbox
- Persistent database storage
- Toast notifications
- Full accessibility audit
- End-to-end tests
- Visual regression testing across mobile and desktop viewports

