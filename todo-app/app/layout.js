import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata = {
  title: "やることリスト",
  description: "Next.js + Bootstrap の ToDo アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-light">{children}</body>
    </html>
  );
}
