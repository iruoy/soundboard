import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-400 font-sans text-black antialiased">
      <div className="container mx-auto px-4">
        <h1 className="py-8 text-5xl xl:text-7xl font-bold text-center">Soundboard</h1>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link href="/dumpert">
            <a>
              <div className="min-w-full p-4 cursor-pointer select-none bg-black text-white border-8 border-black hover:border-white focus:border-white">
                <p className="text-2xl font-bold">Dumpert</p>
              </div>
            </a>
          </Link>

          <Link href="/scouting">
            <a>
              <div className="min-w-full p-4 cursor-pointer select-none bg-black text-white border-8 border-black hover:border-white focus:border-white">
                <p className="text-2xl font-bold">Scouting</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
