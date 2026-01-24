import Image from 'next/image'
import { mountain } from '../constants/images'
import Counter from '../components/counter-component'
import { CorePackageComponent } from '../components/core-package-component'
import { DragAndDropExample } from '../components/drag-and-drop-example'
import PrivateImage from '@repo/ui/components/private-image'

export function GamePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-100 pt-10">
      <Image
        src={mountain.src}
        alt={mountain.alt}
        width={mountain.width}
        height={mountain.height}
        loading="eager"
        className="mb-10 h-48 w-48 rounded-full object-cover"
      />
      <h1 className="text-2xl font-bold">Example Game Page</h1>
      <p className="text-gray-500">This is an example game</p>

      <div>
        <Counter />
      </div>

      <div className="mt-10 rounded-lg bg-slate-50 p-4 shadow-md">
        <CorePackageComponent />
      </div>

      <div className="my-10 rounded-lg bg-slate-50 p-4 shadow-md">
        <DragAndDropExample />
      </div>

      <div className="my-10 rounded-lg bg-slate-50 p-4 shadow-md">
        <h1>Test Images</h1> {/* 'domino/images/dado.webp */}
        <PrivateImage src="domino/images/dado.webp" />
      </div>

      <div className="my-10 rounded-lg bg-slate-50 p-4 shadow-md">
        <h1>UI Package</h1>
        {/* <TopBar /> */}
      </div>
    </div>
  )
}
