import { type NextPage } from "next";
import { signIn } from "next-auth/react";

const Landing: NextPage = () => {
  return (
    <main
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.imgur.com/7Agg5Z4.jpg')" }}
    >
      <div className="w-1/3 rounded-md bg-white bg-opacity-60 p-10 text-center ">
        <h1 className="mb-4 text-4xl">Craft Your Marketing Strategy</h1>
        <p className="mb-6 text-xl">
          Dive into the future of content generation. Leverage the power of
          ChatGPT to design captivating marketing strategies effortlessly.
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
