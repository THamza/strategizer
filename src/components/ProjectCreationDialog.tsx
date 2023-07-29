import { useState, ChangeEvent, FormEvent } from "react";
import ReactDOM from "react-dom";
import { api, type RouterOutputs } from "../utils/api";

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
}

export default function ProjectCreationDialog(props: Props) {
  const { className } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Call the useMutation hook at the top level of your component
  const projectCreationMutation = api.project.create.useMutation({
    onSuccess: (d) => {
      console.log("d", d);
      setIsModalOpen(false);
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    formData.startDate = new Date(formData.startDate);
    formData.endDate = new Date(formData.endDate);
    projectCreationMutation.mutate(formData, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  const modal = (
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
                    Project Creation
                  </h2>
                  <div className="flex space-x-10 ">
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
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>

                    <label>
                      Project End Date:
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
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
                        onChange={handleInputChange}
                        placeholder="We would like to first focus on the US market, and then expand to Morocco next year."
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <button
        className="btn btn-circle btn-outline mt-6"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
      {isModalOpen && ReactDOM.createPortal(modal, document.body)}
    </div>
  );
}
