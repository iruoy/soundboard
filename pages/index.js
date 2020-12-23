import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-20 flex-grow flex flex-col">
        <h1 className="text-7xl font-bold text-center">
          Welcome to <a className="text-blue-500 hover:underline focus:underline" href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className="pt-2 text-2xl text-center">
          Get started by editing{' '}
          <code className="bg-gray-100 rounded p-1 text-xl font-mono">pages/index.js</code>
        </p>

        <div className="mx-auto mt-12 grid lg:grid-cols-2">
          <a className="m-4 p-6 text-left border border-gray-200 rounded-lg transition-colors hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500" href="https://nextjs.org/docs">
            <h3 className="mb-4 text-2xl font-bold">Documentation &rarr;</h3>
            <p className="text-xl">Find in-depth information about Next.js features and API.</p>
          </a>

          <a className="m-4 p-6 text-left border border-gray-200 rounded-lg transition-colors hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500" href="https://nextjs.org/learn">
            <h3 className="mb-4 text-2xl font-bold">Learn &rarr;</h3>
            <p className="text-xl">Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a className="m-4 p-6 text-left border border-gray-200 rounded-lg transition-colors hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500" href="https://github.com/vercel/next.js/tree/master/examples">
            <h3 className="mb-4 text-2xl font-bold">Examples &rarr;</h3>
            <p className="text-xl">Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a className="m-4 p-6 text-left border border-gray-200 rounded-lg transition-colors hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500" href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
            <h3 className="mb-4 text-2xl font-bold">Deploy &rarr;</h3>
            <p className="text-xl">Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </a>
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <a className="py-2 flex justify-center items-center" href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
