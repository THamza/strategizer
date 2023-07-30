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

  const handleCopyToClipboard = (text: string) => {
    void copy(text);
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
              <div
                key={post.id}
                className="card mr-8 w-96 bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <h2 className="card-title">Post {post.id}</h2>
                  <ReactMarkdown>{post.content.slice(0, 100)}</ReactMarkdown>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCopyToClipboard(post.content)}
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      className="btn btn-primary"
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
                <ReactMarkdown>{expandedPost}</ReactMarkdown>
                <div className="modal-action">
                  <button className="btn" onClick={() => setExpandedPost(null)}>
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
