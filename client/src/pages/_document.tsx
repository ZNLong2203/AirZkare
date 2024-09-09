import { Html, Head, Main, NextScript, DocumentProps } from "next/document";

const Document: React.FC<DocumentProps> = () => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;