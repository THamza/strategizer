import React, { useState, ChangeEvent, FormEvent } from "react";
import { api, type RouterOutputs } from "../../utils/api";

interface FormData {
  name: string;
  email: string;
  industry: string;
  targetAudience: string;
  marketingGoals: string;
  budget: string;
  availableChannels: string;
  competitors: string;
  existingChannels: string;
  usp: string;
  startDate: Date;
  endDate: Date;
  additionalInfo: string;
}

interface Props {
  className?: string;
  setIsNewProjectModalOpen: (isOpen: boolean) => void;
}

export default function ProjectCreationForm(props: Props) {
  const { className, setIsNewProjectModalOpen } = props;
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    industry: "",
    targetAudience: "",
    marketingGoals: "",
    budget: "",
    availableChannels: "",
    competitors: "",
    existingChannels: "",
    usp: "",
    startDate: new Date(),
    endDate: new Date(),
    additionalInfo: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    formData.startDate = new Date(formData.startDate);
    formData.endDate = new Date(formData.endDate);
    projectCreationMutation.mutate(formData, {
      onSuccess: () => {
        console.log("created");
        window.location.reload();
        setErrorMessage(null);
        setIsNewProjectModalOpen(false);
      },
      onError: (error) => {
        setErrorMessage(error.message);
      },
    });
  };

  const projectCreationMutation = api.project.create.useMutation({
    // onSuccess: (d) => {
    //   setIsNewProjectModalOpen(false);
    //   setErrorMessage(null);
    // },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    Project Creation
                  </h2>
                  <div className="flex justify-center space-x-10">
                    <label>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ex: Strategizer"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>

                    <label>
                      Industry:
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="ex: Technology"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Target Audience:
                      <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        placeholder="ex: 18-25 year olds interested in VR Gaming"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Marketing Goals:
                      <input
                        type="text"
                        name="marketingGoals"
                        value={formData.marketingGoals}
                        onChange={handleInputChange}
                        placeholder="ex: Increase brand awareness by 20% over 6 months"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>

                  <div>
                    <label>
                      Budget:
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="ex: $1000 per month"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div className="flex w-full justify-center space-x-10">
                    <label>
                      Available Channels:
                      <input
                        type="text"
                        name="availableChannels"
                        value={formData.availableChannels}
                        onChange={handleInputChange}
                        placeholder="ex: Facebook, Instagram, TikTok, Twitter, LinkedIn"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>

                    <label>
                      Competitors:
                      <input
                        type="text"
                        name="competitors"
                        value={formData.competitors}
                        onChange={handleInputChange}
                        placeholder="ex: Google, Facebook, Twitter, LinkedIn, TikTok"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Unique Selling Proposition:
                      <input
                        type="text"
                        name="usp"
                        value={formData.usp}
                        onChange={handleInputChange}
                        placeholder="ex: We are the only VR gaming company that offers VR training for professional gamers"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div className="flex w-full justify-center space-x-10">
                    <label>
                      Project Start Date:
                      <input
                        type="date"
                        name="startDate"
                        // value={formData.startDate}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>

                    <label>
                      Project End Date:
                      <input
                        type="date"
                        name="endDate"
                        // value={formData.endDate}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Additional Information:
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        // onChange={handleInputChange}
                        placeholder="We would like to first focus on the US market, and then expand to Morocco next year."
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>

                  <div className="flex justify-between bg-gray-50 px-4 py-3 sm:flex sm:px-6">
                    <button
                      onClick={() => setIsNewProjectModalOpen(false)}
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
