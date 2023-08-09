import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

import Head from "next/head";

import { SideBar } from "../../components/navigation/SideBar";

export const Header = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated and they are not on the /landing page
    if (!sessionData?.user && router.pathname !== "/landing") {
      router.push("/landing");
    }

    // If the user is authenticated and they are on the /landing page
    if (sessionData?.user && router.pathname === "/landing") {
      router.push("/");
    }
  }, [sessionData]);

  return (
    <>
      <Head>
        <title>Strategizer</title>
        <meta name="description" content="Marketing Strategy Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed left-0 top-0 z-20 w-full border-b border-purple-200 bg-purple-900 bg-opacity-80 backdrop-blur-sm">
        <div className="flex w-full flex-wrap items-center justify-between p-4">
          <a
            href="https://strategizer.thamza.com/"
            className="flex items-center"
          >
            <Image
              src="https://i.imgur.com/0Hjm78S.png"
              className="mr-3 h-8"
              alt="Strategizer Logo"
              width={32}
              height={32}
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-white dark:text-white">
              Strategizer
            </span>
          </a>
          <div className="flex md:order-2">
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="ml-auto hidden h-auto w-full items-center justify-between md:order-1 md:flex md:h-10 md:w-auto"
            id="navbar-sticky"
          >
            {/* Basic Navigation Links */}
            <div className="space-x-4">
              <a href="#" className="text-white hover:text-purple-200">
                Home
              </a>
              <a href="#" className="text-white hover:text-purple-200">
                About
              </a>
              <a href="#" className="text-white hover:text-purple-200">
                Services
              </a>
              <a
                href="https://www.thamza.com/garden#contact"
                className="text-white hover:text-purple-200"
              >
                Contact
              </a>
            </div>
            <div className="ml-8 flex-none gap-2">
              <div className="dropdown dropdown-end">
                {sessionData?.user ? (
                  <label
                    tabIndex={0}
                    className="avatar btn btn-circle btn-ghost"
                    onClick={() => void signOut()}
                  >
                    <div className="w-8 rounded-full">
                      <Image
                        className="rounded-full"
                        width={40}
                        height={40}
                        src={sessionData?.user?.image ?? ""}
                        alt={sessionData?.user?.name ?? ""}
                      />
                    </div>
                  </label>
                ) : (
                  <button
                    className="btn rounded-full bg-white px-6 py-2 text-purple-900 hover:bg-purple-900 hover:text-white"
                    onClick={() => void signIn()}
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {sessionData?.user ? <SideBar /> : <></>}
    </>
  );
};
