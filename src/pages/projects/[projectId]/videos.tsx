import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../../../utils/api";
import ReactMarkdown from "react-markdown";
import { abbreviateText } from "../../../utils/helpers";
import { useRouter } from "next/router";

import "@fortawesome/fontawesome-free/css/all.min.css";

interface VideoScriptSchema {
  id: string;
  content: string;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StoryboardSchema {
  id: string;
  content: string;
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VideoSchema {
  id: string;
  length: number; // in seconds
  projectId: string;
  scripts?: VideoScriptSchema[];
  storyboards?: StoryboardSchema[];
  createdAt: Date;
  updatedAt: Date;
}

const VideosPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const [expandedContent, setExpandedContent] = useState<{
    content: string;
    type: "script" | "storyboard";
  } | null>(null);
  const [videos, setVideos] = useState<VideoSchema[]>([]);

  const [hasFetched, setHasFetched] = useState(false);

  const { isLoading } = api.video.getAll.useQuery(
    { projectId },
    {
      enabled: sessionData?.user !== undefined && !hasFetched,
      onSuccess: (data) => {
        setVideos(data as VideoSchema[]);
        setHasFetched(true);
        console.log(data);
      },
    }
  );

  const handleExpandContent = (
    content: string,
    type: "script" | "storyboard"
  ) => {
    setExpandedContent({ content, type });
  };

  return (
    <>
      <main>
        <div className="ml-72 mt-20">
          <h1 className="text-3xl font-bold">Videos</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="card mr-8 w-96 bg-white shadow-xl">
                <div className="card-body">
                  {/* Display the Video Script */}
                  <div>
                    <h2 className="text-lg font-bold">Script</h2>
                    <div className="flex items-center justify-between">
                      {" "}
                      {/* Add flex container */}
                      <p>
                        {abbreviateText(video.scripts?.[0]?.content || "", 100)}
                      </p>
                      <button
                        className="bg-dark hover:bg-dark-700 rounded-6 btn ml-4 text-white"
                        onClick={() =>
                          handleExpandContent(
                            video.scripts?.[0]?.content || "",
                            "script"
                          )
                        }
                      >
                        Expand
                      </button>
                    </div>
                  </div>
                  <hr className="my-4" />{" "}
                  {/* Divider line between script and storyboard */}
                  {/* Display the Storyboard */}
                  <div>
                    <h2 className="text-lg font-bold">Storyboard</h2>
                    <div className="flex items-center justify-between">
                      {" "}
                      {/* Add flex container */}
                      <p>
                        {abbreviateText(
                          video.storyboards?.[0]?.content || "",
                          100
                        )}
                      </p>
                      <button
                        className="bg-dark hover:bg-dark-700 rounded-6 btn ml-4 text-white"
                        onClick={() =>
                          handleExpandContent(
                            video.storyboards?.[0]?.content || "",
                            "storyboard"
                          )
                        }
                      >
                        Expand
                      </button>
                    </div>
                  </div>
                  {/* Add any other buttons or actions you might need for each video card */}
                  <div className="card-actions mt-8 justify-between">
                    {/* Your action buttons here */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {expandedContent && (
            <div className="modal modal-open">
              <div className="modal-box">
                <ReactMarkdown skipHtml={false}>
                  {expandedContent.content}
                </ReactMarkdown>
                <div className="modal-action">
                  <button
                    className="btn text-white"
                    onClick={() => setExpandedContent(null)}
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

export default VideosPage;
