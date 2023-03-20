import React, { useRef } from "react";

interface Conversation {
  role: string;
  content: string;
}

export default function Home() {
  // States
  const [value, setValue] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const chatHistory = [
        ...conversation,
        { role: "user", content: value },
      ];
      const response = await fetch("/api/openAIChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      setValue("");
      setConversation([
        ...chatHistory,
        {
          role: "assistant",
          content: data.result.choices[0].message.content,
        },
      ]);
    }
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {conversation.map((item, index) => (
            <div
              key={index}
              className={`${
                item.role === "assistant" ? "flex-row-reverse" : ""
              } flex space-x-2`}
            >
              <div
                className={`${
                  item.role === "assistant"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } p-2 rounded-md max-w-max`}
              >
                {item.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            placeholder="Type here"
            className="flex-grow input input-bordered input-secondary rounded-none rounded-l-md"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary ml-2 rounded-none rounded-r-md"
            onClick={handleRefresh}
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
