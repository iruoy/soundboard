import Head from 'next/head'
import Sound from '../components/Sound'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-400 text-black antialiased">
      <Head>
        <title>Scouting - Soundboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4">
        <h1 className="pt-8 text-7xl font-bold text-center">Soundboard</h1>
        <h2 className="pt-4 pb-8 text-6xl font-semibold text-center">Scouting</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Sound src="/sounds/scouting/ik_lig_er_morgen_niet_vanaf.mp3" title="Ik lig er morgen niet vanaf" />
          <Sound src="/sounds/scouting/klusjesmannen_grote_smurf.mp3" title="Klusjesmannen - Grote Smurf" />
          <Sound src="/sounds/scouting/klusjesmannen_hitler.mp3" title="Klusjesmannen - Hitler" />
          <Sound src="/sounds/scouting/klusjesmannen_man_bijt_hond.mp3" title="Klusjesmannen - Man Bijt Hond" />
          <Sound src="/sounds/scouting/peniskoker.mp3" title="Peniskoker" />
        </div>
      </div>
    </div>
  )
}
