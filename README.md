# Peerzada Store

A Next.js e-commerce application with Sanity CMS integration.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-07-03
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy

### Other Hosting Providers

You can also deploy this app to any hosting provider that supports Node.js applications:

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Features

- Product catalog with categories and subcategories
- Blog with Sanity CMS integration
- Responsive design
- WhatsApp ordering integration

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework