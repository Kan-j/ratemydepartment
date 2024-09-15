"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Textarea } from '@/components/ui/textarea'
  import { useState } from 'react'
  import { usePathname, useRouter } from 'next/navigation'
  // import { updateRating } from '@/lib/actions'
  import { Bounce, toast } from 'react-toastify';
  import { Button } from "../ui/button"
  
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


const formSchema = z.object({
    likes:z.string().min(6, {
        message: "Should have at least 6 characters.",
      }),
    dislikes:z.string().min(6, {
        message: "Should have at least 6 characters.",
      }),
    improvements:z.string().min(6, {
        message: "Should have at least 6 characters.",
      }),
});


interface RatingDetailsProp {
  rating: {
  id: number;
  stars: number;
  ratedByUserId: number;
  likes: string;
  dislikes: string;
  improvements: string;
  isPublished: boolean;
  ratedByUser: {
    id: number;
    name: string;
    departmentId: number;
    department: {
      // Define the structure of the department object if needed
      id: number;
      name: string;
      // Add more properties if necessary
    };
  }};
  children:React.ReactNode
}

const EditComment = ({children, rating}: RatingDetailsProp) => {
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          likes: rating.likes,
          dislikes: rating.dislikes,
          improvements: rating.improvements
        },
        })



    //  async function onSubmit(values: z.infer<typeof formSchema>) {
    //    await updateRating({likes: values.likes, dislikes: values.dislikes, improvements: values.improvements, path: pathname, ratingId: rating.id})
    //       setOpen(false)
    //   }


  return (
    <section>
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-[350px] sm:max-w-[425px] text-gray-800">
                    <DialogHeader>
                    <DialogTitle >
                        <h1 className='font-extrabold text-xl'>
                        {`Edit Comment`}</h1></DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form  className="space-y-4">
                            <FormField
                            control={form.control}
                            name="likes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>What did you LIKE about the services provided?</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="I like how they ..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="dislikes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>What did you NOT LIKE about the services provided?</FormLabel>
                                <FormControl>
                                <Textarea placeholder="I did not like ..." {...field}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="improvements"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>How can we improve our services?</FormLabel>
                                <FormControl>
                                <Textarea placeholder="I think they can improve..." {...field}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            {/* <DialogClose className='flex w-full mt-6 mb-3 text-white'> */}
                                <Button type="submit" className="w-full mt-6 mb-3 bg-blue-500 text-white">Submit</Button>
                            {/* </DialogClose> */}
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
    </section>
  )
}

export default EditComment