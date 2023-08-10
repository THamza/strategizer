import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { SOCIAL_MEDIA_PLATFORMS } from "../utils/constants";

export const SocialMediaRadioSelect = (props: {
  setSocialMediaPlatform: Dispatch<SetStateAction<string>>;
  socialMediaPlatform: string;
}) => {
  const { socialMediaPlatform, setSocialMediaPlatform } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSocialMediaPlatform(event.target.value);
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
        Social Media Platform:{" "}
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
        <ul
          className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {SOCIAL_MEDIA_PLATFORMS.map((platform, index) => (
            <li key={platform.name}>
              <label className="mt-4 flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  id={`default-radio-${index}`}
                  type="radio"
                  value={platform.name}
                  name="socialMediaPlatform"
                  className="mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  onChange={handleInputChange}
                  checked={socialMediaPlatform === platform.name ? true : false}
                />
                {platform.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
