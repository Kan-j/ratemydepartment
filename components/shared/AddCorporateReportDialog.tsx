"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Input for quarter, year
import { Checkbox } from "../ui/checkbox"; // Checkbox component for isPublished
import { handleReportUploadAction } from "@/lib/actions"; // Import the server action

// Schema for form validation
const formSchema = z.object({
  quarter: z.string().min(1, "Quarter is required"),
  year: z.string().min(4, "Year is required").regex(/^\d{4}$/, "Invalid year"),
  file: z
    .any()
    .refine((files) => files && files.length > 0, "File upload is required"),
  isPublished: z.boolean(),
});

interface AddCorporateReportDialogProps {
  children: React.ReactNode;
  report?: {
    id: number;
    quarter: string;
    year: string;
    fileUrl: string;
    isPublished: boolean;
  };
}

const AddCorporateReportDialog : React.FC<AddCorporateReportDialogProps> = ({ children, report })=> {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition(); // useTransition for handling server action
  const router = useRouter();
  const pathName = usePathname()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quarter: report?.quarter || "",
      year: report?.year || "",
      file: null, // Files should be uploaded separately
      isPublished: report?.isPublished || false,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('quarter', values.quarter);
    formData.append('year', values.year);
    formData.append('isPublished', String(values.isPublished));
    formData.append('file', values.file[0]);
    formData.append('pathName', pathName);


    startTransition(async () => {
      try {
        const result = await handleReportUploadAction(formData);
        if (result.success) {
          alert("Report uploaded successfully");
          setOpen(false); // Close the dialog on success
          router.refresh(); // Refresh the page or fetch new data
        } else {
          alert("Failed to upload report");
        }
      } catch (error:any) {
        console.error("Error uploading report:", error);
        alert("An error occurred while uploading the report");
      }
    });
  }

  return (
    <section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
          {/* <Button className="text-lg">Add Corporate Report</Button> */}
        </DialogTrigger>
        <DialogContent className="w-full text-gray-800 max-h-screen">
          <DialogHeader>
            <DialogTitle>
              <h1 className="font-extrabold text-xl">Upload Corporate Report</h1>
            </DialogTitle>
          </DialogHeader>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data" >
              {/* Quarter Field */}
              <FormField
                control={form.control}
                name="quarter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quarter</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quarter (e.g., Q1)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year Field */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter year (e.g., 2024)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display existing file link if fileUrl is provided */}
            {report?.fileUrl && (
              <div>
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  View Current file
                </a>
              </div>
            )}

              {/* File Upload Field */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Report</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => field.onChange(e.target.files)} // Handle file selection
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Published Field */}
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-baseline gap-4">
                    <FormLabel>Publish Now</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-6 bg-blue-500 text-white"
                disabled={isPending} // Disable the button while the action is pending
              >
                {isPending ? "Uploading..." : "Upload Report"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AddCorporateReportDialog;
