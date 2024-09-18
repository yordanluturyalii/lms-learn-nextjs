"use client";

import HyperText from "@/components/magicui/hyper-text";
import TypingAnimation from "@/components/magicui/typing-animation";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChartColumnIncreasing, ChevronRight, CreditCard, Film, Folder, Folders } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "./_components/navbar";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";
import { CourseCard } from "./_components/course-card";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Particles from "@/components/magicui/particles";
import GridPattern from "@/components/magicui/grid-pattern"
import { ReviewCard } from "./_components/review-card";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { useRef } from "react";
import Confetti, { ConfettiRef } from "@/components/magicui/confetti";
import Footer from "./_components/footer";
import { IconBadge } from "./_components/icon-badge";
import Meteors from "@/components/magicui/meteors";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
import BoxReveal from "@/components/magicui/box-reveal";


const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Jojo",
    username: "@jojo",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Hokky",
    username: "@hokky",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const LandingPage = () => {

  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <div className="relative">
      <Particles className="absolute inset-0"
        quantity={300}
        ease={80}
        color={"#000"}
        refresh
      />
      <div className="relative flex w-full h-screen flex-col items-center overflow-hidden">
        <Navbar />
        <div className="flex flex-col items-center justify-center w-full h-screen px-4 py-8 md:px-[10%] md:py-16">
          <div className="md:flex md:space-x-3 block">
            <span className="text-6xl font-bold text-black/70 dark:text-white">Eduleap</span>
            <HyperText text="Academy" className="left-10 bg-gradient-to-tr from-[#7e22ce] to-[#701a75]/40 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-[#7e22ce] dark:to-[#701a75]/10" animateOnLoad={true} duration={70} />
          </div>
          <TypingAnimation text="An online learning platform to easily enhance skills with flexibility." duration={40} className="text-muted-foreground text-lg font-normal" />
          <Link href={"/sign-up"}>
            <div className="z-10 flex items-center justify-center mt-4">
              <AnimatedGradientText className="bg-black z-50">
                🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-white" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                  )}
                >
                  Get Started
                </span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-white" />
              </AnimatedGradientText>
            </div>
          </Link>
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 -z-50",
            )}
          />
        </div>
      </div>
      <div className="w-full md:h-screen relative">
        <span className="flex items-center justify-center text-center text-4xl font-bold text-black/70 dark:text-white md:py-6 py-4">Features in Eduleap</span>
        <span className="text-muted-foreground font-normal text-center flex items-center justify-center -mt-5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus ab quod perferendis doloremque! <br /> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo neque</span>
        <div className="md:flex w-full block md:px-[10%] px-4 justify-center items-center my-24">
          <ShineBorder
            className="flex h-72 md:w-96 w-full flex-col justify-start items-start rounded-lg border bg-background md:shadow-xl md:mx-2 my-2 z-50"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <CreditCard className="text-black/80 mb-5 mt-2" />
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="mb-2 text-left text-xl font-medium sm:text-2xl text-black/80">Complete Payment</h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-justify text-sm text-neutral-500 sm:text-base">Accept payments via QRIS, E-wallet, Virtual Account, Debit/Credit Card, and Alfamart.</p>
            </BoxReveal>
          </ShineBorder>
          <ShineBorder
            className="flex h-72  md:w-96 w-full flex-col justify-start items-start rounded-lg border bg-background md:shadow-xl md:mx-2 my-2 z-50"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <Folder className="text-black/80 mb-5 mt-2" />
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="mb-2 text-left text-xl font-medium sm:text-2xl text-black/80">Course Management</h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-justify text-sm text-neutral-500 sm:text-base">This feature lets instructors easily create and manage courses, organize content, assign instructors, and track progress.</p>
            </BoxReveal>
          </ShineBorder>
          <ShineBorder
            className="flex h-72  md:w-96 w-full flex-col justify-start items-start rounded-lg border bg-background md:shadow-xl md:mx-2 my-2 z-50"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <ChartColumnIncreasing className="text-black/80 mb-5 mt-2" />
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="mb-2 text-left text-xl font-medium sm:text-2xl text-black/80">Tracking and Reporting</h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-justify text-sm text-neutral-500 sm:text-base">This feature tracks students' progress in video learning</p>
            </BoxReveal>
          </ShineBorder>
          <ShineBorder
            className="flex h-72 md:w-96 w-full flex-col justify-start items-start rounded-lg border bg-background md:shadow-xl md:mx-2 my-2 z-50"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <Film className="text-black/80 mb-5 mt-2" />
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="mb-2 text-left text-xl font-medium sm:text-2xl text-black/80">Multimedia Content Integration</h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-justify text-sm text-neutral-500 sm:text-base">Enables embedding videos, audio, presentations, and interactive materials into courses for enhanced learning experiences.</p>
            </BoxReveal>
          </ShineBorder>
        </div>
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            "[mask-image:linear-gradient(to_top_left,white,transparent,transparent)] -z-50",
          )}
        />
      </div>
      <div className="w-full py-[90px] relative">
        <span className="flex items-center justify-center text-center text-4xl font-bold text-black/70 dark:text-white md:py-6 py-4">Explore Featured Courses</span>
        <span className="text-muted-foreground font-normal text-center flex items-center justify-center -mt-5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus ab quod perferendis doloremque! <br /> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo neque</span>
        <div className="w-full flex flex-wrap justify-around md:px-[10%] px-4 py-4">
          <CourseCard title="Learn Next.js" imageUrl={"/next-js.jpg"} chaptersLength={10} category={"Frontend"} />
          <CourseCard title="Advanced Web Development" imageUrl={"/web-dev.jpg"} chaptersLength={1} category={"Web"} />
          <CourseCard title="Full Course Premier Pro" imageUrl={"/premier-pro.jpg"} chaptersLength={13} category={"Film"} />
          <CourseCard title="Learn Next.js" imageUrl={"/premier-pro.jpg"} chaptersLength={10} category={"Frontend"} />
          <CourseCard title="Advanced Web Development" imageUrl={"/next-js.jpg"} chaptersLength={1} category={"Web"} />
          <CourseCard title="Full Course Premier Pro" imageUrl={"/web-dev.jpg"} chaptersLength={13} category={"Film"} />
        </div>
        <Link href={"/search"}>
          <ShimmerButton background="#9c40ff" className="mx-auto text-center">
            More Courses
          </ShimmerButton>
        </Link>
      </div>
      <div className="w-full relative z-50 py-20">
        <div className="md:px-[10%] px-4">
          <span className="flex items-center justify-center text-center text-4xl font-bold text-black/70 dark:text-white md:py-6 py-4">Messages from satisfied customers 💖</span>
          <span className="text-muted-foreground font-normal text-center flex items-center justify-center text-xl">We love helping you learn new skills.</span>
          <div className="flex flex-wrap justify-around z-50 mt-14">
            {
              reviews.map((review) => (
                <>
                  <ReviewCard key={review.username} {...review} />
                  <Confetti
                    ref={confettiRef}
                    className="absolute left-0 top-0 z-0 size-full"
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                  />
                </>
              ))
            }
          </div>
        </div>
        <GridPattern
          width={40}
          height={40}
          x={1}
          y={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] -z-50",
          )}
        />
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
