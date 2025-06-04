import React, { useState } from "react";
import { Icon } from "@iconify/react";

const supportData = [
  {
    title: "My Profile",
    questions: [
      {
        q: "How can I change my Personal information?",
        a: [
          "1. Open our website stravix.in",
          "2. Login with your registered email ID",
          "3. Click on the profile icon (top right)",
          "4. In dropdown, click ‘My Profile’",
          "5. You'll get the option to edit personal details (Email, Phone, Address)",
        ],
      },
      {
        q: "How can I change my name on profile?",
        a: [],
      },
      {
        q: "How can I change my registered email id?",
        a: [],
      },
      {
        q: "How can I update/change my contact number?",
        a: [],
      },
      {
        q: "How can I check offers?",
        a: [],
      },
    ],
  },
  {
    title: "My Course",
    questions: [],
  },
  {
    title: "Social Media Connect",
    questions: [],
  },
];

const SupportHub = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Support Hub
      </h1>

      {supportData.map((section, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-md mb-4 overflow-hidden"
        >
          <button
            onClick={() => toggleIndex(idx)}
            className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-800"
          >
            {section.title}
            <Icon
              icon={openIndex === idx ? "mdi:minus" : "mdi:plus"}
              className="text-purple-600 text-2xl"
            />
          </button>

          {openIndex === idx && (
            <div className="px-6 pb-4 border-t border-yellow-400">
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="py-2 text-sm">
                  <p className="font-medium text-gray-700">{q.q}</p>
                  {q.a.length > 0 && (
                    <ul className="list-decimal list-inside text-gray-600 mt-1 space-y-1">
                      {q.a.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SupportHub;
