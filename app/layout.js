import './globals.css'


export const metadata = {
  title: 'SmartMeter',
  description: 'SmartMeter by Rinvent',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      
      <body >{children}</body>
    </html>
  )
}
