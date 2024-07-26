import React from "react";
import { timeZoneMap } from "@/lib/Timezone"; // Adjust the path as necessary

interface TimezoneDropdownProps {
  selectedTimeZone: string;
  handleTimeZoneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TimezoneDropdown: React.FC<TimezoneDropdownProps> = ({
  selectedTimeZone,
  handleTimeZoneChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="timezone"
        className="block text-sm font-medium text-gray-700"
      >
        Timezone
      </label>
      <select
        id="timezone"
        name="timezone"
        value={selectedTimeZone}
        onChange={handleTimeZoneChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      >
        {Object.keys(timeZoneMap).map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneDropdown;