import { useState } from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import { type RouterOutputs } from "../utils/api";

// type Note = RouterOutputs["note"]["getAll"][0];

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: any;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Extract the first sentence from content.
  const firstSentenceMatch = note.content.match(/[^.!?]+[.!?]/);
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[0] : "";

  // Remove the first sentence from the content.
  const remainingContent = note.content.replace(firstSentence, "").trim();

  // Format the createdAt timestamp into a human-readable format.
  const timeAgo = moment(note.createdAt).fromNow();

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        {/* Time ago display */}
        <div className="text-right text-sm text-gray-400">{timeAgo}</div>

        {/* Collapsable title and content */}
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Display the first sentence of the content as the title */}
          <div className="collapse-title text-xl font-bold">
            {firstSentence}
          </div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{remainingContent}</ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Delete button */}
        <div className="card-actions mx-2 flex justify-end">
          <button className="btn btn-warning btn-xs px-5" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
