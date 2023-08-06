import React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { api, type RouterOutputs } from "../../utils/api";
import { SOCIAL_MEDIA_PLATFORMS } from "../utils/constants";

interface Props {
  className?: string;
  projectId: string | undefined;
  setIsNewPostModalOpen: (isOpen: boolean) => void;
}

export default function PostCreationForm(props: Props) {
  const { className, projectId, setIsNewPostModalOpen } = props;
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [selectSocialMediaPlatform, setSelectSocialMediaPlatform] =
    useState<string>("");

  const postCreationMutation = api.post.create.useMutation({
    onSuccess: (d) => {
      console.log("created");
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectSocialMediaPlatform(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      setErrorMessage("Project ID is required");
      return;
    }
    if (!selectSocialMediaPlatform) {
      setErrorMessage("Social Media Platform is required");
      return;
    }

    postCreationMutation.mutate(
      {
        projectId,
        socialMediaPlatform: selectSocialMediaPlatform,
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle ${className}`}
        >
          <div className="w-full bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="w-full sm:flex sm:items-start">
              <div className="sm: mr-4 mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <h2 className="mb-4 text-center text-2xl font-bold">
                    Post Creation
                  </h2>
                  <div>
                    <label>
                      Social Media Platform:
                      <select
                        name="socialMediaPlatform"
                        value={selectSocialMediaPlatform}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                      >
                        {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                          <option key={platform.name} value={platform.name}>
                            {platform.icon} {platform.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex justify-between bg-gray-50 px-4 py-3 sm:flex sm:px-6">
                    <button
                      onClick={() => setIsNewPostModalOpen(false)}
                      type="button"
                      className="mb-2 mr-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Close
                    </button>
                    {errorMessage && (
                      <div>
                        <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                          <strong className="font-bold">{errorMessage}</strong>
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="mb-2 mr-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
