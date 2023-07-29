import React, { useEffect, useState, ReactNode, useRef } from "react";
import { api, type RouterOutputs } from "../../utils/api";
import { useSession } from "next-auth/react";

interface ProjectSummary {
  id: string;
  name: string;
  counts: {
    posts: number;
    videos: number;
    seoKeywords: number;
  };
}

type DataKey = "posts" | "videos" | "seoKeywords";

interface SubMenuProps {
  title: string;
  project: ProjectSummary;
  icon: ReactNode;
  link: string;
  dataKey: DataKey;
}

const SubMenu = ({ title, project, icon, link, dataKey }: SubMenuProps) => {
  return (
    <a
      href={link}
      className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    >
      {icon}
      <span className="ml-3 flex-1 whitespace-nowrap">{title}</span>
      <span className="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {project.counts[dataKey]}
      </span>
    </a>
  );
};

export function SideBar() {
  const { data: sessionData } = useSession();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const { data: projectSummary, isLoading } = api.project.getSummary.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined && !hasFetched,
      onSuccess: (data) => {
        setProjects(
          data.map((project) => {
            return {
              id: project.id,
              name: project.name,
              counts: project.counts,
            };
          }) ?? []
        );
        setHasFetched(true);
      },
    }
  );

  return (
    <>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="separator-sidebar"
        className="fixed left-0 top-24 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li className="border-b">
              <a
                href=""
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            {!isLoading &&
              projects &&
              projects.map((project: ProjectSummary) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className="group flex w-full items-center rounded-lg p-2 text-base text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      setExpandedProjects((prev) =>
                        prev === project.id ? null : project.id
                      );
                    }}
                  >
                    <svg
                      className="h-6 w-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 10h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H17M1 10v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M1 10l2-9h12l2 9M6 4h6M5 7h8"
                      />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap text-left">
                      {project.name}
                    </span>
                    <svg
                      className="h-3 w-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                    <svg className="h-3 w-3" aria-hidden="true" />
                  </button>

                  {expandedProjects === project.id && (
                    <ul
                      className={`ml-6`}
                      style={{
                        maxHeight:
                          expandedProjects === project.id ? "100vh" : "0",
                      }}
                    >
                      <li>
                        <SubMenu
                          dataKey="posts"
                          title="Posts"
                          project={project}
                          icon={
                            <svg
                              className="h-6 w-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18 5h1v12a2 2 0 0 1-2 2m0 0a2 2 0 0 1-2-2V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v15a2 2 0 0 0 2 2h14ZM10 4h2m-2 3h2m-8 3h8m-8 3h8m-8 3h8M4 4h3v3H4V4Z"
                              />
                            </svg>
                          }
                          link={"/projects/" + project.id + "/posts"}
                        />
                      </li>
                      <li>
                        <SubMenu
                          dataKey="videos"
                          title="Videos"
                          project={project}
                          icon={
                            <svg
                              className="h-6 w-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 14"
                            >
                              <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                            </svg>
                          }
                          link={"/projects/" + project.id + "/videos"}
                        />
                      </li>
                      <li>
                        <SubMenu
                          dataKey="seoKeywords"
                          title="SEO Keywords"
                          project={project}
                          icon={
                            <svg
                              className="h-6 w-6 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 16 20"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 1v4a1 1 0 0 1-1 1H1m4 4 1 6 2-4 2 4 1-6m4-8v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"
                              />
                            </svg>
                          }
                          link={"/projects/" + project.id + "/seo-keywords"}
                        />
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            {isLoading && (
              // center spinner
              <div
                role="status"
                className="flex items-center justify-center pt-10"
              >
                <svg
                  aria-hidden="true"
                  className="mr-2 h-8 w-8 animate-spin fill-black text-gray-200 dark:text-gray-600"
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
          </ul>
        </div>
      </aside>
    </>
  );
}
