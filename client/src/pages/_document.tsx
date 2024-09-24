import { Html, Head, Main, NextScript, DocumentProps } from "next/document";

const Document: React.FC<DocumentProps> = () => {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;