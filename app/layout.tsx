import { Providers } from "../components/Providers";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "rounded-lg border px-4 py-3 shadow-md flex items-start gap-3 w-full max-w-sm bg-[#F6FFF9] border-[#48C1B5] text-[#2F3F53] font-[400]",
              title: "text-[#27303A] font-[600]",
              description: "text-[14px] text-[#2F3F53]",
              actionButton: "bg-transparent text-[#48C1B5]",
              cancelButton: "text-[#979FA9]",
              closeButton: "text-[#979FA9] hover:text-black",
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
