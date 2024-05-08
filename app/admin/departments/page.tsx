import QuarterSelector from "@/components/shared/QuarterSelector"
import SmallScreenInput from "@/components/shared/SmallScreenInput"

const page = () => {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen="small"/>
        </section>
        <SmallScreenInput/>
      </section>
    </div>
  )
}

export default page