import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
      <Head>
        <title>Soundboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <h1 className="py-8 text-7xl font-bold text-center">Soundboard</h1>

        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          <a href="/dumpert">
            <div className="m-4 p-6 cursor-pointer select-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors hover:border-blue-500 focus:border-blue-500">
              <p className="text-2xl font-bold">Dumpert</p>
            </div>
          </a>

          <a href="/scouting">
            <div className="m-4 p-6 cursor-pointer select-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors hover:border-blue-500 focus:border-blue-500">
              <p className="text-2xl font-bold">Scouting</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
