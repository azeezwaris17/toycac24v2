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

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">3. Attire:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Dress modestly and appropriately according to Islamic principles..</li>
        <li className="text-gray-800">Avoid wearing clothing with offensive or inappropriate images, slogans, or symbols..</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">4. Behavior and Interaction:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Refrain from engaging in any form of disruptive or disrespectful behavior.</li>
        <li className="text-gray-800">Be attentive and engaged during sessions, and participate actively in discussions.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">5. Technology Use:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Use electronic devices only when necessary and maintain respectful behavior during sessions.</li>
        <li className="text-gray-800">Ensure your devices are set to silent mode to avoid disrupting the proceedings.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">6. Environmental Stewardship:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Respect the event venue and surrounding areas by disposing of waste properly.</li>
        <li className="text-gray-800">Contribute to sustainability efforts by minimizing your use of single-use plastics.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">7. No Unauthorized Distribution:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Obtain proper authorization before distributing any materials or promoting other events.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">8. Photography and Recording:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Seek permission before photographing or recording individuals or sessions.</li>
        <li className="text-gray-800">Respect the privacy of others who may not wish to be captured in media.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">9. Emergency Procedures:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Familiarize yourself with emergency exits and evacuation procedures at the venue.</li>
        <li className="text-gray-800">Follow instructions from event staff in case of an emergency.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">10. Health and Well-being:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Take care of your health and well-being during the event.</li>
        <li className="text-gray-800">Stay hydrated, get adequate rest, and seek medical attention if necessary.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">11. Networking and Interaction:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Use this opportunity to connect and interact with fellow attendees and speakers.</li>
        <li className="text-gray-800">Respect personal boundaries and engage in meaningful conversations.</li>
      </ul>
    </div>

    
    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">12. Lifelines and Fair Play:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Participate in all competitions and activities with honesty and integrity.</li>
        <li className="text-gray-800">Do not engage in cheating, plagiarism, or any form of unfair play.</li>
      </ul>
    </div>

    <div className="mb-8">
      <h2 className="text-[#647862] text-lg font-semibold mb-2">13. Feedback and Suggestions:</h2>
      <ul className="list-disc pl-6">
        <li className="text-gray-800">Provide constructive feedback to organizers for continuous improvement.</li>
        <li className="text-gray-800">Your input is valuable in enhancing future camps.</li>
      </ul>
    </div>

    
    <div className="mb-8">
      <p className="text-gray-500"><span className="text-[#647862]">N.B-</span>Failure to adhere to these rules and regulations may result in unfriendly action being taken by the camp organizers. Your cooperation ensures a positive and rewarding experience for everyone at the TIMSAN Oyo State 2024 Camp and Conference.</p>
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
          I agree to abide by all the rules and regulations.
        </label>
      </div>
    </div>
  </div>
  );
}
