/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../../../utils/api";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import copy from "clipboard-copy";

import "@fortawesome/fontawesome-free/css/all.min.css";

interface PostSchema {
  id: string;
  content: string;
  projectId: string;
}

const PostsPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostSchema[]>([]);

  const [hasFetched, setHasFetched] = useState(false);
  const [copyPerformed, setCopyPerformed] = useState(false);

  const { isLoading } = api.post.getAll.useQuery(
    { projectId },
    {
      enabled: sessionData?.user !== undefined && !hasFetched,
      onSuccess: (data) => {
        setPosts(data);
        setHasFetched(true);
      },
    }
  );

  const handleCopyToClipboard = async (text: string) => {
    await copy(text);
    setCopyPerformed(true);
    setTimeout(() => setCopyPerformed(false), 2000);
    return;
  };
  const handleExpandPost = (post: PostSchema) => {
    setExpandedPost(post.content);
  };

  return (
    <>
      <main>
        <div className="row ml-72 mt-20">
          <h1 className="text-3xl font-bold">Posts</h1>
          <div className="flex">
            {posts.map((post) => (
              <div key={post.id} className="card mr-8 w-96 bg-white shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-8">{post.id}</h2>
                  <ReactMarkdown skipHtml={false}>
                    {post.content.slice(0, 100)}
                  </ReactMarkdown>
                  <div className="card-actions mt-8 justify-between">
                    <button
                      className="rounded-6 btn border-white bg-white hover:bg-white "
                      onClick={() => handleCopyToClipboard(post.content)}
                    >
                      {!copyPerformed ? (
                        <svg
                          className="h-4 w-4 text-gray-800"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 2h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m6 0a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m6 0v3H6V2M5 5h8m-8 5h8m-8 4h8"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-gray-800"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                        </svg>
                      )}
                    </button>

                    <button
                      // make smaller button
                      className="bg-dark hover:bg-dark-700 rounded-6 btn text-white"
                      onClick={() => handleExpandPost(post)}
                    >
                      Expand
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {expandedPost && (
            <div className="modal modal-open">
              <div className="modal-box">
                <ReactMarkdown skipHtml={false}>{expandedPost}</ReactMarkdown>
                <div className="modal-action">
                  <button
                    className="btn text-white"
                    onClick={() => setExpandedPost(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default PostsPage;
