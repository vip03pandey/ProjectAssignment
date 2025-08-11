import React from "react";
import { BackgroundLines } from "../Components/ui/background-lines";
import { InfiniteMovingCardsDemo } from "../Components/common/ReviewCards";
import { useNavigate } from "react-router-dom";
export function BackgroundLinesDemo() {
    const navigate = useNavigate();

    const redirectToSignup = (role) => {
        navigate(`/signup?role=${role}`);
    };
  return (
    <BackgroundLines className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 
                      pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-16 lg:pb-16">
        

        <h1
          className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white 
          text-2xl leading-tight
          sm:text-3xl sm:leading-tight
          md:text-4xl md:leading-tight  
          lg:text-5xl lg:leading-tight
          xl:text-6xl xl:leading-tight
          2xl:text-7xl 2xl:leading-tight
          font-sans font-bold tracking-tight 
          relative z-20 
          mb-4 sm:mb-6 
          max-w-4xl mx-auto
          mt-4 sm:mt-0">
          Your Gateway to<br className="block sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Global<br className="block sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Regulatory Expertise
        </h1>


        <p
          className="text-center text-neutral-700 dark:text-neutral-400 
          text-sm leading-relaxed mb-6
          sm:text-base sm:mb-8
          md:text-lg md:mb-10
          lg:text-xl 
          max-w-2xl mx-auto px-2">
          Upload your regulatory questions with background context and receive professional evaluation
        </p>


        <div className="flex flex-col w-full max-w-sm gap-3 mb-8 sm:flex-row sm:max-w-md sm:gap-4 sm:mb-12 z-20 relative">
          <button className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => redirectToSignup("client")}>
            Join as Client
          </button>
          <button className="w-full px-6 py-3.5 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg font-semibold transition-all duration-200"
          onClick={() => redirectToSignup("provider")}>
            Join as Provider
          </button>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12 w-full max-w-2xl text-center z-20 relative">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">500+</span>
            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Queries Processed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">50+</span>
            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Countries</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">100+</span>
            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Experts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">24hr</span>
            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Avg Response</span>
          </div>
        </div>


        <div className="w-full">
          <InfiniteMovingCardsDemo/>
        </div>
      </div>
    </BackgroundLines>
  );
}