import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Fauna+One&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/SoundJS/1.0.2/soundjs.min.js"
            integrity="sha512-tWGC9KCH7gq1wgk/ZwaX1kd7bQq8M8ekETvWy0Mk8d9+d9XWHR4F3CuzbPJnUnu/eyEX/rPyYguXHtvN6WzcRQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
