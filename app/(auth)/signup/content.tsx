"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUpParams, signUpSchema } from "@/lib/validation";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import Link from "next/link";
import { signUp } from "./actions";

export const Content = () => {
  return (
    <div className="relative flex h-screen w-screen flex-row items-center justify-center bg-  login">
      <Card className="relative z-20 w-full max-w-md px-6 py-4 shadow-xl max-sm:rounded-none">
        <h1 className={"mb-5 text-3xl"}>Sign up</h1>
        <SignUpForm />
      </Card>
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-white/15 backdrop-blur supports-[backdrop-filter]:bg-white/25" />
    </div>
  );
};

function SignUpForm() {
  const form = useForm<signUpParams>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: signUpParams) => {
    const error = await signUp(values);
    if (!!error) {
      form.setError("root", { type: "server", message: error });
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
        {form.formState.errors.root?.message && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit">Sign up</Button>
      </form>
    </Form>
  );
}
