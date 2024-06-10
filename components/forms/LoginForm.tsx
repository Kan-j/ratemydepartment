"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { signIn } from "next-auth/react"

const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

export const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    })
 
  // 2. Define a submit handler.
  const onSubmit= async(values: z.infer<typeof formSchema>) =>{
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: "/"
      })
  }

  return (
    <section className="w-72 sm:w-80 md:w-96">
      <section className="flex flex-col items-center gap-4 mb-3">
        <Image src="/assets/vra-logo.jpg" className="  bg-white" alt="VRA logo" width={120} height={30} />
        <h3 className="font-bold text-2xl text-blue-400">RateA<span className="text-white bg-blue-400 px-2">Department</span></h3>
      </section>
      

        {/* <h4 className="uppercase text-base text-center font-bold mt-5 mb-2">Login</h4> */}
        <h2 className="text-base font-medium mb-5 text-gray-800 text-center">Log In To Your Account </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="firstName.lastName@vra.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-500 mt-6 mb-3 text-white">Submit</Button>
          </form>
        </Form>
    </section>
  )
}
