"use client";
import React from "react";
import { Label } from "../Components/ui/label";
import { Input } from "../Components/ui/input";
import { cn } from "../lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconMail,
} from "@tabler/icons-react";
import { Boxes } from "../Components/ui/background-boxes";

export function SignIn() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <div className="absolute inset-0 z-0">
          <Boxes />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500" />
        </div>

      {/* Form container */}
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white/95 backdrop-blur-lg p-4 md:rounded-2xl md:p-8  dark:backdrop-blur-lg relative z-20 border border-white/10">
        <h2 className="text-xl font-bold text-neutral-800 ">Welcome Back</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-800 ">
          Sign in to your regulatory management account
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4 ">
            <Label htmlFor="email" className="!text-black">Email Address</Label>
            <Input id="email" placeholder="your@email.com" type="email" />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="password" className="!text-black">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600 ">
            Don't have an account?{" "}
            <a href="/signup?role=client" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div> // ← This was misplaced before. Now correct.
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};