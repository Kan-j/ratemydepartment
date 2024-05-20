import Providers from '@/components/auth/Providers';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Rate My Department",
  description: "Here is the rate my department app for VRA",
};

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  )
}
