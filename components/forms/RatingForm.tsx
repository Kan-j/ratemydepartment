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
  import { useRouter } from 'next/navigation'
  import { createRating } from '@/lib/actions'
  import { Bounce, toast } from 'react-toastify';
import { Rating } from "react-simple-star-rating"
import { Button } from "../ui/button"
  
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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


const RatingForm = ({department, email, pathname, children}:{department:{
    name: string,
    id: number
}, email: string |null |undefined, pathname:string, children: React.ReactNode}) => {
    const [rating, setRating] = useState(0)
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          likes: "",
          dislikes: "",
          improvements: ""
        },
        })
    
    // Catch Rating value
    const handleRating = (rate: number) => {
    setRating(rate)
    // other logic
    }
    
     // 2. Define a submit handler.
     async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const userDetails = await fetch(`/api/department?email=${email}`)
        const response = await userDetails.json()
        const userId = response.user.id;
        await createRating({departmentId: department.id,likes:values.likes, dislikes: values.dislikes,improvements: values.improvements,path:pathname,stars:rating,userId:userId})
        toast(`Your rating has been sent`,{
             position: 'top-center',
             autoClose: 5000,
             theme: "light",
             transition: Bounce,
             type: "success"
          })
          form.reset()
          setOpen(false)
          router.push(pathname)
      }


  return (
    <section>
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                    {/* <Button className="bg-blue-400"><span className='pr-2 text-lg'>Rate</span>  
                    <Rating size={24} allowHover={false} readonly={true} initialValue={1}  iconsCount={1} fillColor='#ffffff'/></Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] text-gray-800">
                    <DialogHeader>
                    <DialogTitle >
                        <h1 className='font-extrabold text-xl'>
                        {`Rate ${department.name}`}</h1></DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                            <label className='text-sm font-medium'>How satisfied are you with the service provided?</label>
                            <Rating className='inline' size={24}  onClick={handleRating} />
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

export default RatingForm