import React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { api, type RouterOutputs } from "../../utils/api";

interface Props {
  className?: string;
  projectId: string | undefined;
  setIsNewSeoKeywordsModalOpen: (isOpen: boolean) => void;
}

export default function SeoKeywordsCreationForm(props: Props) {
  const { className, projectId, setIsNewSeoKeywordsModalOpen } = props;
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guidance, setGuidance] = useState<string>("");

  const seoKeywordsCreationMutation = api.seoKeywords.create.useMutation({
    onSuccess: (d) => {
      console.log("created");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!projectId) {
      setErrorMessage("Project ID is required");
      return;
    }

    seoKeywordsCreationMutation.mutate(
      {
        projectId,
        guidance,
      },
      {
        onSuccess: () => {
          window.location.reload();
          setIsLoading(false);
        },
        onError: (error) => {
          setErrorMessage(error.message);
          setIsLoading(false);
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
          className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle ${
            className ? className : ""
          }`}
        >
          <div className="w-full bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="w-full sm:flex sm:items-start">
              <div className="sm: mr-4 mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <h2 className="mb-4 text-center text-2xl font-bold">
                    Seo Keywords Generation
                  </h2>
                  <div>
                    <label>
                      Directives:
                      <textarea
                        name="guidance"
                        value={guidance}
                        onChange={(e) => setGuidance(e.target.value)}
                        placeholder="Provive some additional guidance for the AI to generate a post for YOU!"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  {!isLoading ? (
                    <div className="flex justify-between bg-gray-50 px-4 py-3 sm:flex sm:px-6">
                      <button
                        onClick={() => setIsNewSeoKeywordsModalOpen(false)}
                        type="button"
                        className="mb-2 mr-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                      >
                        Close
                      </button>
                      {errorMessage && (
                        <div>
                          <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                            <strong className="font-bold">
                              {errorMessage}
                            </strong>
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
                  ) : (
                    <div role="status" className="flex justify-center">
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
