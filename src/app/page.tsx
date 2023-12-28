import MaxWidthWrapper from "@/components/MaxWidthWrapper"
export default function Home() {
  return <>
    <MaxWidthWrapper>
      <div className=' flex justify-center items-center h-screen'>
        <div className="text-center max-w-[800px]">
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            AQUI VA EL LOGIN{'  '}
            <span className='text-yellow-600'>
              LEONARRDOS Y SANTIAGOS
            </span>

          </h1>
        </div>
      </div>
    </MaxWidthWrapper>
  </>
}
