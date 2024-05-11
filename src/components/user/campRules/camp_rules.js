import React, { useState } from "react";
import { MdCheck } from "react-icons/md";

export default function CampRules() {
    const [agree, setAgree] = useState(false);

    const handleAgreeChange = () => {
      setAgree(!agree);
    };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="text-[#DFBF76] text-2xl font-semibold mb-4">
        TIMSAN Oyo State Camp and Conference 2024 - Rules and Regulations
      </h1>
      <p className="text-gray-800">
        Dear Participants, We are glad to welcome you to the TIMSAN Oyo
        State Camp and Conference 2024. To ensure a safe, respectful, and
        enriching experience for all attendees, we have established the
        following rules and regulations. Your cooperation by abiding to this rules will be greatly
        appreciated.
      </p>
    </div>
    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">1. Respect and Conduct:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Treat all participants, organizers, guests, and speakers with respect and kindness.</li>
        <li className="text-gray-800">Maintain a positive and inclusive attitude, fostering an environment of unity and understanding.</li>
      </ul>
    </div>
    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">2. Attendance:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Attend all scheduled sessions, lectures, workshops, and activities.</li>
        <li className="text-gray-800">Punctuality is important; please arrive on time for all events.</li>
      </ul>
    </div>
    {/* Add more rules in a similar structure */}
    {/* Repeat the structure for rules 3 to 15 */}
    <div className="mb-8">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="agree"
          className="mr-2 text-[#647862]"
          checked={agree}
          onChange={handleAgreeChange}
        />
        <label htmlFor="agree" className="text-gray-800">
          I agree to all the rules and regulations.
        </label>
      </div>
    </div>
  </div>
  );
}
