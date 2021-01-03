import Head from 'next/head'
import Audio from '../components/Audio'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Jason</title>
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
                    <Audio title="Startup" src="/sounds/windows xp/Windows XP Startup.wav" />
                    <Audio title="Shutdown" src="/sounds/windows xp/Windows XP Shutdown.wav" />
                    <Audio title="Recycle" src="/sounds/windows xp/Windows XP Recycle.wav" />
                    <Audio title="Error" src="/sounds/windows xp/Windows XP Error.wav" />
                </div>
            </main>

            <footer className="border-t border-gray-200">
                <a className="py-2 flex justify-center items-center" href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    Powered by{' '}
                    <img className="h-4 ml-2" src="/vercel.svg" alt="Vercel Logo" />
                </a>
            </footer>
        </div>
    )
}
