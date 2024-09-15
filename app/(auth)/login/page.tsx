import { LoginForm } from "@/components/forms/LoginForm"
export const dynamic = 'force-dynamic';
const LoginPage = () => {

  return (
    <section className="flex flex-col gap-6">
      <section className="bg-white px-6 py-6 rounded-xl">
        <LoginForm/>
      </section>
    </section>
  )
}

export default LoginPage