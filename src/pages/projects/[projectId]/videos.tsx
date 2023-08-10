import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../../../utils/api";
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

  return (
    <>
      <main>
        <div className="ml-72 mt-20">
          <h1 className="text-3xl font-bold">Videos</h1>
          <div className="video-list-container">
            {videos.map((video) => (
              <div key={video.id} className="card mr-8 w-96 bg-white shadow-xl">
                <div className="card-body">
                  {/* Display the Video Script */}
                  <div>
                    <h2 className="text-lg font-bold">Script</h2>
                    <p>
                      {abbreviateText(video.scripts?.[0]?.content || "", 100)}
                    </p>
                    {/* Add an expand button if the content is long and you want to display it in a modal or popup */}
                  </div>
                  <hr className="my-4" />{" "}
                  {/* Divider line between script and storyboard */}
                  {/* Display the Storyboard */}
                  <div>
                    <h2 className="text-lg font-bold">Storyboard</h2>
                    <p>
                      {abbreviateText(
                        video.storyboards?.[0]?.content || "",
                        100
                      )}
                    </p>
                    {/* Similarly, add an expand button if the storyboard is long and you want to display it in a modal or popup */}
                  </div>
                  {/* Add any other buttons or actions you might need for each video card */}
                  <div className="card-actions mt-8 justify-between">
                    {/* Your action buttons here */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default VideosPage;
