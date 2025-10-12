// pages/_app.js
import 'spotify-dual-play\src\app\globals.css';
import '../../../src/app/global.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
