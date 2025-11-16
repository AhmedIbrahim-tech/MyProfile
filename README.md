# Ahmed Ibrahim - Portfolio Website

A modern, responsive portfolio website showcasing my skills, experience, and projects as a Full Stack .NET Core Developer.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark Theme**: Modern dark theme with purple accents inspired by professional designs
- **Dynamic Projects**: Automatically fetches and displays projects from GitHub
- **Multiple Sections**:
  - Hero section with contact information
  - Skills/Technologies showcase
  - Work experience timeline
  - Education details
  - Projects gallery with GitHub integration
  - Contact form

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Custom CSS with modern design patterns
- **Build Tool**: Vite
- **API Integration**: Axios for GitHub API calls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd myprofile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
myprofile/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── ContactPage.tsx
│   ├── data/             # Data files
│   │   └── profileData.ts
│   ├── App.tsx           # Main app component with routing
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── index.html           # HTML template
```

## Features in Detail

### GitHub Integration
The Projects section automatically fetches repositories from the GitHub API and displays them with:
- Repository name and description
- Topics/tags
- Star and fork counts
- Primary programming language
- Direct links to GitHub repositories

### Contact Form
A fully functional contact form with:
- Form validation
- Success/error feedback
- Multiple subject categories
- Responsive design

### Smooth Navigation
- Fixed header with active state indicators
- Smooth scroll behavior
- Mobile-responsive navigation

## Customization

To customize the portfolio with your own information:

1. Update `src/data/profileData.ts` with your personal information, experience, education, and skills
2. Change the GitHub username in `src/components/Projects.tsx` (line 26)
3. Update contact information and social links throughout the components

## License

This project is open source and available under the MIT License.

## Contact

Ahmed Ibrahim Ahmed
- Email: ahmedebrahim.official@gmail.com
- GitHub: https://github.com/AhmedIbrahim-tech
- LinkedIn: https://www.linkedin.com/in/ahmed-ebrahim-ahmed
