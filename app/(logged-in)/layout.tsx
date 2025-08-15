import { TransactionProvider } from "../../components/TransactionContext";
import { Providers } from "../../components/Providers";
import { Navigation } from "../../components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TransactionProvider>
            <div className="flex gap-4 justify-between min-h-screen w-full">
              <Navigation />

              <div className="w-full mt-8 mr-8">{children}</div>
            </div>
          </TransactionProvider>
        </Providers>
      </body>
    </html>
  );
}
