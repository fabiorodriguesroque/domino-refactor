import Link from 'next/link'
import { levels } from '../constants/levels'

export function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-5xl font-bold tracking-tight text-white">
          Domino
        </h1>
        <p className="text-lg">Escolhe um nível para começar</p>
        <p className="text-sm">Página temporária para testes</p>
      </div>

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {levels.map((level) => (
          <Link
            key={level.id}
            href={`/domino/${level.id}`}
            className="group border-dark/80 hover:border-dark/90 relative rounded-2xl border bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-white/20"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-lg font-medium text-gray-700">
                Nível {level.id}
              </span>
              <span className="text-sm text-gray-500">
                {level.tiles.length} peças
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
