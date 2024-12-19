"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form/form";
import { Check, ChevronsUpDown, ChevronLeft } from "lucide-react";
import { Input } from "@/components/Input/input";
import { Button } from "@/components/Button/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/Calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/popover";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/Command/command";
import { Textarea } from "@/components/TextArea/textarea";
import { ImageSelector } from "@/components/ImageSelector/ImageSelector";
import { useRouter } from "next/navigation";

const priceRanges = [
  { label: "$10 - $20", value: "10-20" },
  { label: "$20 - $30", value: "20-30" },
  { label: "$30 - $40", value: "30-40" },
  { label: "$40 - $50", value: "40-50" },
  { label: "$50 - $60", value: "50-60" },
  { label: "$60 - $70", value: "60-70" },
  { label: "$70 - $80", value: "70-80" },
  { label: "$80 - $90", value: "80-90" },
  { label: "$90 - $100", value: "90-100" },
] as const;

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Group name must be at least 2 characters long",
  }),
  groupName: z.string().min(2, {
    message: "Group name must be at least 2 characters long",
  }),
  groupDescription: z.string().min(2, {
    message: "Group name must be at least 2 characters long",
  }),
  groupBudget: z.number().min(0, {
    message: "Budget must be a positive number",
  }),
  giftDrawingDate: z.date(),
  giftExchangeDate: z.date(),
  priceRanges: z.string({
    required_error: "Please select a Price Range.",
  }),
  selectedImage: z.string(),
});
export default function CreateGroupPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      groupDescription: "",
      giftDrawingDate: new Date(),
      giftExchangeDate: new Date(),
      priceRanges: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className=" flex justify-center align-center flex-col">
      <div className="flex flex-row">
        <Button
          className="bg-clear"
          type="button"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft></ChevronLeft>
          <p>Back to user dashboard</p>
        </Button>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="bg-white w-1/2 mb-5 flex justify-center align-center rounded flex-col ">
          <h2 className="font-bold m-5">Create Secret Santa Page</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="m-5">Group Name</FormLabel>
                    <FormControl>
                      <Input
                        className="m-5 w-4/5"
                        placeholder="Secret Santa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="m-5">Group Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="m-5 w-4/5"
                        placeholder="Secret Santa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectedImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="m-5">Group Theme Image</FormLabel>
                    <FormControl>
                      <ImageSelector {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceRanges"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="m-5">Price Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between m-5 w-4/5",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? priceRanges.find(
                                  (priceRanges) =>
                                    priceRanges.value === field.value
                                )?.label
                              : "Select a price range"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search Price Ranges..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {priceRanges.map((priceRanges) => (
                                <CommandItem
                                  value={priceRanges.label}
                                  key={priceRanges.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "priceRanges",
                                      priceRanges.value
                                    );
                                  }}
                                >
                                  {priceRanges.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      priceRanges.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="m-5">
                      Please select the price range for your Secret Santa group!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giftDrawingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mx-5 mt-5">
                      Gift Drawing Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal m-5 w-4/5",
                              !field.value && "text-muted-foreground "
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="ml-5">
                      When names will be drawn for the gift exchange.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giftExchangeDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mx-5 mt-5">
                      Gift Exchange Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal m-5 w-4/5",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="ml-5">
                      When the gift exchange will take place.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start m-5">
                <Button className="m-2" type="submit">
                  Create Group
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
