"use client";

import { Button } from "@/components/Button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card/card";
import { Input } from "@/components/Input/input";
import { Progress } from "@/components/Progress/progress";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select/select";

// Use an empty schema for steps without a form
const stepOneSchema = z.object({});

const stepTwoSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  giftCircle: z.string().min(1, {
    message: "Please enter your gift-giving circle.",
  }),
});

// Combined schema for the entire form
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  giftCircle: z.string().min(1, {
    message: "Please enter your gift-giving circle.",
  }),
});

type Step = {
  title: string;
  description: string;
  schema: z.AnyZodObject;
};

const steps: Step[] = [
  {
    title: "Welcome to Elecretanta✨",
    description: "Let's find your perfect gift match",
    schema: stepOneSchema,
  },
  {
    title: "About You",
    description: "First let's get to know each other",
    schema: stepTwoSchema,
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(steps[currentStep].schema),
    defaultValues: {
      name: "",
      giftCircle: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      form.setValue("name", data.display_name);
    };
    fetchProfile();
  }, [form]);

  function next() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function back() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function onSubmit() {
    if (currentStep === steps.length - 1) {
      // TODO: Replace with API call to update profile in DB
      console.log("Form data:", form.getValues());
    } else {
      next();
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-lg">
        <Progress value={(currentStep / steps.length) * 100} className="my-4" />
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-center">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                {/* Conditionally render the form Fields for each step */}
                {currentStep === 0 && (
                  <>
                    <div className="bg-pink-100 w-fit p-3 rounded-full mx-auto mb-4">
                      <Gift className="text-red-600" />
                    </div>
                    <h3 className="font-bold text-center">Hello, John Doe!</h3>
                    <p className="text-center">
                      Our elf-powered AI is here to help you create your gift
                      profile. In just a few minutes, we&apos;ll help your
                      Secret Santa discover the perfect gift for you
                    </p>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How should we call you?</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is how you&apos;ll appear to your Secret Santa
                            group
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="giftCircle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Which gift-giving circle do you belong to?
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your age group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-12">0 - 12 years</SelectItem>
                              <SelectItem value="13-17">
                                13 - 17 years
                              </SelectItem>
                              <SelectItem value="18-24">
                                18 - 24 years
                              </SelectItem>
                              <SelectItem value="25-34">
                                25 - 34 years
                              </SelectItem>
                              <SelectItem value="35-44">
                                35 - 44 years
                              </SelectItem>
                              <SelectItem value="45-54">
                                45 - 54 years
                              </SelectItem>
                              <SelectItem value="55-64">
                                55 - 64 years
                              </SelectItem>
                              <SelectItem value="65+">65+ years</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
              <CardFooter>
                <div
                  className={
                    "flex w-full " +
                    (currentStep === 0 ? "justify-end" : "justify-between")
                  }
                >
                  {currentStep !== 0 && (
                    <Button type="button" variant="secondary" onClick={back}>
                      <ChevronLeft />
                      Back
                    </Button>
                  )}
                  <Button type="submit">
                    {currentStep < steps.length - 1 ? "Next" : "Submit"}
                    <ChevronRight />
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}
