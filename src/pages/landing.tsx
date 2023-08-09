import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const Landing: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is logged in, redirect to the homepage
    if (sessionData?.user) {
      router.push("/");
    }
  }, [sessionData]);

  return (
    <main
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.imgur.com/7Agg5Z4.jpg')" }}
    >
      <div className="w-1/3 rounded-md bg-white bg-opacity-80 p-10 text-center ">
        <h1 className="mb-4 text-4xl">Craft Your Marketing Strategy</h1>
        <p className="mb-6 text-xl">
          Dive into the future of content generation. Leverage the power of AI
          to design captivating marketing strategies effortlessly.
        </p>
        <button
          onClick={() => void signIn()}
          className="btn rounded-full bg-white px-6 py-2 text-purple-900 hover:bg-purple-900 hover:text-white"
        >
          Begin Your Journey
        </button>
      </div>
    </main>
  );
};

export default Landing;
