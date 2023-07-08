import React from "react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export default function CreateProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [marketingGoals, setMarketingGoals] = useState("");
  const [budget, setBudget] = useState("");
  const [availableChannels, setAvailableChannels] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [USP, setUSP] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Call the createProject mutation using tRPC
    const projectCreationMutation = api.project.create.useMutation();

    // Execute the mutation
    await projectCreationMutation.mutateAsync({
      project: {
        name,
        industry,
        targetAudience,
        marketingGoals,
        budget: parseFloat(budget),
        availableChannels,
        competitors,
        USP,
        additionalInfo,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // Redirect to the projects listing page
    router.push("/projects");
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
          placeholder="USP"
          value={USP}
          onChange={(e) => setUSP(e.target.value)}
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
