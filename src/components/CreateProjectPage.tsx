import React, { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";

export default function CreateProjectPage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [marketingGoals, setMarketingGoals] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [availableChannels, setAvailableChannels] = useState<string>("");
  const [competitors, setCompetitors] = useState<string>("");
  const [usp, setUsp] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Call the createProject mutation using tRPC outside the component function
  const projectCreationMutation = api.project.create.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    projectCreationMutation
      .mutateAsync({
        name,
        industry,
        targetAudience,
        marketingGoals,
        budget,
        availableChannels,
        competitors,
        usp,
        additionalInfo,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .then(() => {
        void router.push("/");
      })
      .catch((error) => {
        console.error("Project creation failed:", error);
      });
  };

  return (
    <div>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Target Audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        />
        <input
          type="text"
          placeholder="Marketing Goals"
          value={marketingGoals}
          onChange={(e) => setMarketingGoals(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="text"
          placeholder="Available Channels"
          value={availableChannels}
          onChange={(e) => setAvailableChannels(e.target.value)}
        />
        <input
          type="text"
          placeholder="Competitors"
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
        />
        <input
          type="text"
          placeholder="usp"
          value={usp}
          onChange={(e) => setUsp(e.target.value)}
        />
        <input
          type="text"
          placeholder="Additional Info"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
