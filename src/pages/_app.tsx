import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import ProjectCreationDialog from "../components/ProjectCreationDialog";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <div className="fixed bottom-0 right-0 z-10 flex items-center justify-end pb-4 pr-4">
        <ProjectCreationDialog />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
