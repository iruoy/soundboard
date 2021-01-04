import Head from 'next/head'
import Sound from '../components/Sound'

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
            <Head>
                <title>Soundboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="container mx-auto">
                <h1 className="py-8 text-7xl font-bold text-center">Soundboard</h1>

                <div className="grid lg:grid-cols-2">
                    <Sound title="Windows XP Startup" src="/sounds/windows xp/Windows XP Startup.wav" />
                    <Sound title="Windows XP Shutdown" src="/sounds/windows xp/Windows XP Shutdown.wav" />
                    <Sound title="Windows XP Recycle" src="/sounds/windows xp/Windows XP Recycle.wav" />
                    <Sound title="Windows XP Error" src="/sounds/windows xp/Windows XP Error.wav" />
                </div>
            </div>
        </div>
    )
}
