import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
} from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

type Project = {
  id: string;
  name: string;
  industry: string;
  // Add other properties here
};

type ProjectsResponse = Project[];

const ProjectsPage = () => {
  const user = useUser();
  const router = useRouter();

  // Fetch the projects data using tRPC
  // const { data: projects, isLoading } = useQuery<ProjectsResponse>(
  //   "projects",
  //   api.project.

  // );

  useEffect(() => {
    // Redirect to the home page if the user is not signed in
    console.log(user);
    if (!user.isSignedIn) {
      router.push("/");
    }
  }, [user]);

  return (
    <div>
      <h1>Projects</h1>
      {/* {isLoading ? (
        <p>Loading...</p>
      ) : ( */}
      <ul>
        {/* {projects?.map(
          (project: {
            id: Key | null | undefined;
            name:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | PromiseLikeOfReactNode
              | null
              | undefined;
          }) => (
            <li key={project.id}>
              <Link href={`/projects/${project.id}`}>
                <a>{project.name}</a>
              </Link>
            </li>
          )
        )} */}
      </ul>
      {/* )} */}
      <Link href="/projects/new">Create New Project</Link>
    </div>
  );
};

export default ProjectsPage;
