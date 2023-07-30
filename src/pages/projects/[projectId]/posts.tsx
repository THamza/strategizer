import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../../../utils/api";

const PostsPage: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <main>
        <div className="ml-72 mt-20">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-xl">This is a test page.</p>
        </div>
      </main>
    </>
  );
};

export default PostsPage;
