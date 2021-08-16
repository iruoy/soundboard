import Sound from '../components/Sound'

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-400 text-black antialiased">
      <div className="container mx-auto px-4">
        <h1 className="pt-8 text-5xl xl:text-7xl font-bold text-center">Soundboard</h1>
        <h2 className="pt-4 text-4xl xl:text-6xl font-semibold text-center">Windows XP</h2>

        <div className="py-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Sound src="/sounds/windows_xp/Windows XP Balloon.mp3" title="Windows XP Balloon" />
          <Sound src="/sounds/windows_xp/Windows XP Battery Critical.mp3" title="Windows XP Battery Critical" />
          <Sound src="/sounds/windows_xp/Windows XP Battery Low.mp3" title="Windows XP Battery Low" />
          <Sound src="/sounds/windows_xp/Windows XP Critical Stop.mp3" title="Windows XP Critical Stop" />
          <Sound src="/sounds/windows_xp/Windows XP Default.mp3" title="Windows XP Default" />
          <Sound src="/sounds/windows_xp/Windows XP Ding.mp3" title="Windows XP Ding" />
          <Sound src="/sounds/windows_xp/Windows XP Error.mp3" title="Windows XP Error" />
          <Sound src="/sounds/windows_xp/Windows XP Exclamation.mp3" title="Windows XP Exclamation" />
          <Sound src="/sounds/windows_xp/Windows XP Feed Discovered.mp3" title="Windows XP Feed Discovered" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Fail.mp3" title="Windows XP Hardware Fail" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Insert.mp3" title="Windows XP Hardware Insert" />
          <Sound src="/sounds/windows_xp/Windows XP Hardware Remove.mp3" title="Windows XP Hardware Remove" />
          <Sound src="/sounds/windows_xp/Windows XP Information Bar.mp3" title="Windows XP Information Bar" />
          <Sound src="/sounds/windows_xp/Windows XP Logoff Sound.mp3" title="Windows XP Logoff Sound" />
          <Sound src="/sounds/windows_xp/Windows XP Logon Sound.mp3" title="Windows XP Logon Sound" />
          <Sound src="/sounds/windows_xp/Windows XP Menu Command.mp3" title="Windows XP Menu Command" />
          <Sound src="/sounds/windows_xp/Windows XP Minimize.mp3" title="Windows XP Minimize" />
          <Sound src="/sounds/windows_xp/Windows XP Notify.mp3" title="Windows XP Notify" />
          <Sound src="/sounds/windows_xp/Windows XP Print complete.mp3" title="Windows XP Print complete" />
          <Sound src="/sounds/windows_xp/Windows XP Recycle.mp3" title="Windows XP Recycle" />
          <Sound src="/sounds/windows_xp/Windows XP Restore.mp3" title="Windows XP Restore" />
          <Sound src="/sounds/windows_xp/Windows XP Ringin.mp3" title="Windows XP Ringin" />
          <Sound src="/sounds/windows_xp/Windows XP Ringout.mp3" title="Windows XP Ringout" />
          <Sound src="/sounds/windows_xp/Windows XP Shutdown.mp3" title="Windows XP Shutdown" />
          <Sound src="/sounds/windows_xp/Windows XP Start.mp3" title="Windows XP Start" />
          <Sound src="/sounds/windows_xp/Windows XP Startup.mp3" title="Windows XP Startup" />
          <Sound src="/sounds/windows_xp/classic chimes.mp3" title="Classic chimes" />
          <Sound src="/sounds/windows_xp/classic chord.mp3" title="Classic chord" />
          <Sound src="/sounds/windows_xp/classic ding.mp3" title="Classic ding" />
          <Sound src="/sounds/windows_xp/classic notify.mp3" title="Classic notify" />
          <Sound src="/sounds/windows_xp/classic recycle.mp3" title="Classic recycle" />
          <Sound src="/sounds/windows_xp/classic ringin.mp3" title="Classic ringin" />
          <Sound src="/sounds/windows_xp/classic ringout.mp3" title="Classic ringout" />
          <Sound src="/sounds/windows_xp/classic start.mp3" title="Classic start" />
          <Sound src="/sounds/windows_xp/classic tada.mp3" title="Classic tada" />
          <Sound src="/sounds/windows_xp/windows xp pop-up blocked.mp3" title="Windows XP pop-up blocked" />
        </div>
      </div>
    </div>
  )
}
