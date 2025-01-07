"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, loginParams } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "./actions";

export const Content = () => {
  return (
    <div className="relative flex h-screen w-screen flex-row items-center justify-center bg-login">
      <Card className="relative z-20 w-full max-w-md px-6 py-4 shadow-xl max-sm:rounded-none">
        <h1 className={"mb-5 text-3xl"}>Login</h1>
        <LoginForm />
      </Card>
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-white/25 backdrop-blur" />
    </div>
  );
};

function LoginForm() {
  const form = useForm<loginParams>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: loginParams) => {
    console.log(values);
    const error = await login(values);
    if (!!error) {
      form.setError("root", { type: "server", message: error });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>

        {form.formState.errors.root?.message && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
