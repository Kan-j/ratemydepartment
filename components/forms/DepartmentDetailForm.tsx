"use client"

import { Rating } from 'react-simple-star-rating'
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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


interface DepartmentDetails {
    department: {
      id: number;
      name: string;
      ratings: { id: number; stars: number; }[];
    };
    totalRatings: number;
    starsCount: { [key: number]: number };
    averageStars: number;
  }


const DepartmentDetail = ({department,totalRatings,starsCount,averageStars}:DepartmentDetails) => {
    
    const starRatings = [
        { label: 'Exceptional', value: 5 },
        { label: 'Exceeds', value: 4 },
        { label: 'Average(Meet)', value: 3 },
        { label: 'Below Average', value: 2 },
        { label: 'Poor', value: 1 }
      ];
      

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          likes: "",
          dislikes: "",
          improvements: ""
        },
        })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <section className='flex justify-around w-full'>
        <article>
            <div className="flex">
               <h1 className="text-5xl font-bold">{averageStars}</h1>
               <p className="text-sm font-bold">/5</p>
            </div>
            <h1 className="font-semibold mb-3">Overall Quality Based on <span className="underline">
                {totalRatings} ratings</span></h1>
            <h1 className="text-5xl font-bold mb-4">{department.name}</h1>
            <Dialog >
                <DialogTrigger asChild>
                    <Button className="bg-blue-400"><span className='pr-2 text-lg'>Rate</span>  
                    <Rating size={24} allowHover={false} readonly={true} initialValue={1}  iconsCount={1} fillColor='#ffffff'/></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] text-gray-800">
                    <DialogHeader>
                    <DialogTitle >
                        <h1 className='font-extrabold text-xl'>Rate Technical Services</h1></DialogTitle>
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
                            <Rating className='inline' size={24}  />
                            <Button type="submit" className="w-full bg-blue-500 mt-6 mb-3 text-white">Submit</Button>
                        </form>
                    </Form>
                    {/* <DialogFooter>
                    <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </article>

        <article>
            <h1 className='font-bold text-xl mb-3'>Rating Distribution</h1>
            <section className='flex flex-row items-center gap-6'>
                <div>
                    <h1 className="text-6xl">{averageStars}</h1>
                    <section className='flex '>
                        <Rating className='inline' size={23} initialValue={4.5} allowHover={false} readonly={true} allowFraction={true}/>
                    </section>
                    <p className="font-semibold">{totalRatings} reviews</p>
                </div>
                <div>
                {starRatings.map((rating, index) => (
                    <article key={index} className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">{rating.label}</p>
                        <Rating size={20} initialValue={rating.value} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>({starsCount[rating.value] || 0})</span>
                    </article>
                    ))}
                    {/* <article className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">Exceptional</p>
                        <Rating  size={20} initialValue={5} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>(10)</span>
                    </article>
                    <article className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">Exceeds</p>
                        <Rating  size={20} initialValue={4} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>(10)</span>
                    </article>
                    <article className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">Average(Meet)</p>
                        <Rating  size={20} initialValue={3} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>(10)</span>
                    </article>
                    <article className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">Below Average</p>
                        <Rating  size={20} initialValue={2} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>(10)</span>
                    </article>
                    <article className='grid grid-cols-3 align-middle items-center gap-3'>
                        <p className="text-sm font-bold">Poor</p>
                        <Rating  size={20} initialValue={1} allowHover={false} readonly={true} allowFraction={true}/>
                        <span className='text-xs font-bold'>(10)</span>
                    </article> */}
                    
                </div>
            </section>
            
        </article>
    </section>
  )
}

export default DepartmentDetail