export const metadata = {
    title: 'Wordle Game',
    description: 'A fullstack Wordle game built with Next.js',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  }