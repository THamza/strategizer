import { useState } from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ProjectCreationForm from "./forms/ProjectCreationForm";
import PostCreationForm from "./forms/PostCreationForm";
import SeoKeywordsCreationForm from "./forms/SeoKeywordsCreationForm";
import VideoCreationForm from "./forms/VideoCreationForm";
interface Props {
  className?: string;
}

export default function ContentCreationDialog(props: Props) {
  const { className } = props;
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewSeoKeywordsModalOpen, setIsNewSeoKeywordsModalOpen] =
    useState(false);
  const [isNewVideoModalOpen, setIsNewVideoModalOpen] = useState(false);

  const projectId = router.query.projectId as string | undefined;
  console.log("sessionData", sessionData);
  return (
    <div className={className}>
      {sessionData && (
        <div className="fixed bottom-0 right-0 z-10 flex items-center justify-end pb-4 pr-4">
          <ul className="bg-black-200 menu rounded-box lg:menu-horizontal">
            <li>
              <details>
                <summary>Create</summary>
                <ul>
                  <li>
                    <a onClick={() => setIsNewProjectModalOpen(true)}>
                      Project
                    </a>
                  </li>

                  {projectId && (
                    <li>
                      <details>
                        <summary>Content</summary>
                        <ul>
                          <li>
                            <a onClick={() => setIsNewPostModalOpen(true)}>
                              Post
                            </a>
                          </li>
                          <li>
                            <a onClick={() => setIsNewVideoModalOpen(true)}>
                              Videos
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => setIsNewSeoKeywordsModalOpen(true)}
                            >
                              Seo Keywords
                            </a>
                          </li>
                        </ul>
                      </details>
                    </li>
                  )}
                </ul>
              </details>
            </li>
          </ul>

          {isNewProjectModalOpen &&
            ReactDOM.createPortal(
              <ProjectCreationForm
                setIsNewProjectModalOpen={setIsNewProjectModalOpen}
              />,
              document.body
            )}
          {isNewPostModalOpen &&
            ReactDOM.createPortal(
              <PostCreationForm
                setIsNewPostModalOpen={setIsNewPostModalOpen}
                projectId={projectId}
              />,
              document.body
            )}
          {isNewSeoKeywordsModalOpen &&
            ReactDOM.createPortal(
              <SeoKeywordsCreationForm
                setIsNewSeoKeywordsModalOpen={setIsNewSeoKeywordsModalOpen}
                projectId={projectId}
              />,
              document.body
            )}
          {isNewVideoModalOpen &&
            ReactDOM.createPortal(
              <VideoCreationForm
                setIsNewVideoModalOpen={setIsNewVideoModalOpen}
                projectId={projectId}
              />,
              document.body
            )}
        </div>
      )}
    </div>
  );
}
