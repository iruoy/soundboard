import Head from 'next/head'

export default function Layout({ children }) {
    return (
      <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>Soundboard</title>
            <meta name="description" content="Alle beste sounds verzameld in een soundboard" />

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="194x194" href="/favicon-194x194.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FBBF24" />
            <meta name="msapplication-TileColor" content="#FBBF24" />
            <meta name="theme-color" content="#FBBF24" />
        </Head>
        <main>{children}</main>
      </>
    )
  }
  