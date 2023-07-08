import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import CreateProjectPage from "./components/(CreateProjectPage)";

export default function Home() {
  const user = useUser();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#fffff] to-[#BD6AE3]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {!user.isSignedIn && <SignInButton />}
          {user.isSignedIn && (
            <>
              <CreateProjectPage />
              <SignOutButton />
            </>
          )}
        </div>
      </main>
    </>
  );
}
