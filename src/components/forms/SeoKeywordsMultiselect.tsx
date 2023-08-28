import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../../utils/api";

interface SeoKeywordSchema {
  id: string;
  keyword: string;
  projectId: string;
  pertinence: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SeoKeywordsMultiselect = (props: {
  setSelectedSeoKeywords: Dispatch<SetStateAction<SeoKeywordSchema[]>>;
  projectId: string | undefined;
}) => {
  const { data: sessionData } = useSession();
  const { projectId, setSelectedSeoKeywords } = props;
  const [hasFetchedSeoKeywords, setHasFetchedSeoKeywords] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [seoKeywords, setSeoKeywords] = useState<SeoKeywordSchema[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  const { isLoading } = api.seoKeywords.getAll.useQuery(
    { projectId: projectId || "" },
    {
      enabled: sessionData?.user !== undefined && !hasFetchedSeoKeywords,
      onSuccess: (data) => {
        setSeoKeywords(data);
        setHasFetchedSeoKeywords(true);
      },
    }
  );

  const handleKeywordSelection = (
    event: ChangeEvent<HTMLInputElement>,
    keywordObject: SeoKeywordSchema
  ) => {
    if (event.target.checked) {
      // If the checkbox is checked, add the keywordObject to the list
      setSelectedSeoKeywords((prevKeywords) => [
        ...prevKeywords,
        keywordObject,
      ]);
    } else {
      // If the checkbox is unchecked, remove the keywordObject from the list
      setSelectedSeoKeywords((prevKeywords) =>
        prevKeywords.filter((keyword) => keyword.id !== keywordObject.id)
      );
    }
  };

  return (
    <>
      <button
        id="dropdownSearchButton"
        data-dropdown-toggle="dropdownSearch"
        data-dropdown-placement="bottom"
        className="inline-flex w-full items-center justify-between rounded-lg border border-gray-300 border-gray-300 bg-gray-50 px-5 py-2.5 text-center text-sm font-medium text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Keywords to include{" "}
        <svg
          className="ml-2.5 h-2.5 w-2.5 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownSearch"
        className={`z-10 ${
          isDropdownOpen ? "" : "hidden"
        } w-full rounded-lg bg-white shadow dark:bg-gray-700 `}
      >
        <div className="p-3">
          <label htmlFor="add-keyword-input" className="sr-only">
            Add New Keyword
          </label>
          <div className="flex">
            {" "}
            <div className="relative flex-grow">
              {" "}
              <input
                type="text"
                id="add-keyword-input"
                className="h-10 w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2 pl-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Add new keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
            </div>
            <button
              // className="h-10 rounded-r-lg bg-blue-500 px-4 py-2  text-white hover:bg-blue-600 focus:outline-none"
              className="h-10 rounded-r-lg bg-gray-500 px-4 py-2  text-white"
              // disable this button
              disabled={true}
              onClick={(e) => {
                e.preventDefault();
                setNewKeyword("");
                setSelectedSeoKeywords((prevKeywords) => [
                  ...prevKeywords,
                  {
                    id: "new" + Math.random().toString(),
                    keyword: "testettt s",
                    projectId: projectId || "",
                    pertinence: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]);
              }}
            >
              Add
            </button>
          </div>
        </div>

        <ul
          className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {seoKeywords.map((keywordObject) => (
            <div
              key={keywordObject.id}
              className="flex rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex h-5 items-center">
                <input
                  id="helper-checkbox-2"
                  aria-describedby="helper-checkbox-text-2"
                  type="checkbox"
                  value={keywordObject.keyword}
                  onChange={(e) => handleKeywordSelection(e, keywordObject)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
              </div>
              <div className="ml-2 text-sm" key={keywordObject.id}>
                <label
                  htmlFor="helper-checkbox-2"
                  className="font-medium text-gray-900 dark:text-gray-300"
                >
                  <div>{keywordObject.keyword}</div>
                  <p
                    id="helper-checkbox-text-2"
                    className="text-xs font-normal text-gray-500 dark:text-gray-300"
                  >
                    Pertinence: {keywordObject.pertinence}/10
                  </p>
                </label>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};
