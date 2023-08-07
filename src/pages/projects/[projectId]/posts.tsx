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
import { abbreviateText } from "../../../utils/helpers";
import copy from "clipboard-copy";
import moment from "moment";

import "@fortawesome/fontawesome-free/css/all.min.css";

interface PostSchema {
  id: string;
  content: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
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
    setTimeout(() => setCopyPerformed(false), 800);
    return;
  };
  const handleExpandPost = (post: PostSchema) => {
    setExpandedPost(post.content);
  };

  const extractFirstSentence = (content: string) => {
    return content.split(".")[0] + ".";
  };

  return (
    <>
      <main>
        <div className="row ml-72 mt-20">
          <h1 className="text-3xl font-bold">Posts</h1>
          {!isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card mr-8 w-96 bg-white shadow-xl"
                >
                  <div className="card-body">
                    {/* Display the first sentence as the title */}
                    <div className="text-right text-sm text-gray-400">
                      {moment(post.createdAt).fromNow()}
                    </div>
                    <h2 className="card-title mb-4 mt-2">
                      {abbreviateText(extractFirstSentence(post.content), 50)}
                    </h2>
                    {/* Display the "time ago" message */}
                    <ReactMarkdown skipHtml={false}>
                      {abbreviateText(
                        post.content
                          .replace(extractFirstSentence(post.content), "")
                          .trim(),
                        250
                      )}
                      {/* Remove the first sentence from the content */}
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
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
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
          ) : (
            <div
              role="status"
              className="absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
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
