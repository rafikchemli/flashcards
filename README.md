# Pilates Instructor Exam Flashcards

A modern, interactive flashcard application designed to help Pilates instructors study and memorize exercises for certification exams. Built with Next.js and React.

🧘 [Pilates Flashcards App](https://flash-pilates.netlify.app/)

## Features

- **Flashcard Study System**: Randomized presentation of exercises to optimize learning
- **Progress Tracking**: Visual progress indicators to track your study session
- **Bilingual Support**: Toggle between English and French translations
- **Exercise Management**: Add, edit, or hide exercises from the study rotation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All your changes are saved locally in your browser

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Date Handling**: [date-fns](https://date-fns.org/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pilates_flashcards.git
   cd pilates_flashcards/vercepp_app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Home Page
The landing page provides a simple entry point to start your flashcard study session.

### Flashcards Page
- Cards are presented in a randomized order
- Flip cards to reveal exercise descriptions
- Navigate between cards using the prev/next buttons
- Track your progress with the progress bar
- Reset your session to start over with a new random order

### Manage Page
- View all available exercises
- Edit exercise titles and descriptions in both languages
- Hide exercises you don't want to study
- Reset to default exercises if needed

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com), but can be deployed on any platform that supports Next.js.

```bash
# Build for production
npm run build
# or
pnpm build

# Start production server
npm run start
# or
pnpm start
```

## Customization

### Adding New Exercises
Edit the `data/exercices.json` file or use the management interface to add new exercises.

### Styling
The application uses Tailwind CSS for styling. Customize the design by editing the `tailwind.config.ts` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Exercise data compiled from standard Pilates certification materials
- UI components built with [shadcn/ui](https://ui.shadcn.com/) component system 
