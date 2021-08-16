import Sound from '../components/Sound'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-400 text-black antialiased">
      <div className="container mx-auto px-4">
        <h1 className="pt-8 text-5xl xl:text-7xl font-bold text-center">Soundboard</h1>
        <h2 className="pt-4 pb-8 text-4xl xl:text-6xl font-semibold text-center">Windows XP</h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Sound src="/sounds/windows_xp/peniskoker.mp3" title="Peniskoker" />
          <Sound src="/sounds/windows_xp/Windows XP Balloon.mp3" title="Windows XP Balloon.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Battery Critical.mp3" title="Windows XP Battery Critical.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Battery Low.mp3" title="Windows XP Battery Low.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Critical Stop.mp3" title="Windows XP Critical Stop.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Default.mp3" title="Windows XP Default.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Ding.mp3" title="Windows XP Ding.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Error.mp3" title="Windows XP Error.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Exclamation.mp3" title="Windows XP Exclamation.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Feed Discovered.mp3" title="Windows XP Feed Discovered.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Fail.mp3" title="Windows XP Hardware Fail.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Insert.mp3" title="Windows XP Hardware Insert.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Remove.mp3" title="Windows XP Hardware Remove.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Information Bar.mp3" title="Windows XP Information Bar.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Logoff Sound.mp3" title="Windows XP Logoff Sound.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Logon Sound.mp3" title="Windows XP Logon Sound.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Menu Command.mp3" title="Windows XP Menu Command.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Minimize.mp3" title="Windows XP Minimize.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Notify.mp3" title="Windows XP Notify.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Print complete.mp3" title="Windows XP Print complete.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Recycle.mp3" title="Windows XP Recycle.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Restore.mp3" title="Windows XP Restore.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Ringin.mp3" title="Windows XP Ringin.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Ringout.mp3" title="Windows XP Ringout.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Shutdown.mp3" title="Windows XP Shutdown.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Start.mp3" title="Windows XP Start.mp3" />
          <Sound src="/sounds/windows_xp/Windows XP Startup.mp3" title="Windows XP Startup.mp3" />
          <Sound src="/sounds/windows_xp/classic chimes.mp3" title="classic chimes.mp3" />
          <Sound src="/sounds/windows_xp/classic chord.mp3" title="classic chord.mp3" />
          <Sound src="/sounds/windows_xp/classic ding.mp3" title="classic ding.mp3" />
          <Sound src="/sounds/windows_xp/classic notify.mp3" title="classic notify.mp3" />
          <Sound src="/sounds/windows_xp/classic recycle.mp3" title="classic recycle.mp3" />
          <Sound src="/sounds/windows_xp/classic ringin.mp3" title="classic ringin.mp3" />
          <Sound src="/sounds/windows_xp/classic ringout.mp3" title="classic ringout.mp3" />
          <Sound src="/sounds/windows_xp/classic start.mp3" title="classic start.mp3" />
          <Sound src="/sounds/windows_xp/classic tada.mp3" title="classic tada.mp3" />
          <Sound src="/sounds/windows_xp/windows xp pop-up blocked.mp3" title="windows xp pop-up blocked.mp3" />
        </div>
      </div>
    </div>
  )
}
