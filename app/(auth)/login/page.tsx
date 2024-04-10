import { LoginForm } from "@/components/forms/LoginForm"
import Image from "next/image"

const Page = () => {

  return (
    <section className="flex flex-col gap-6">
      <section className="bg-white px-6 py-6 rounded-xl">
        <LoginForm/>
      </section>
    </section>
  )
}

export default Page