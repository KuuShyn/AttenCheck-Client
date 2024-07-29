import React from "react";

interface TimezoneDropdownProps {
  selectedTimeZone: string;
  handleTimeZoneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const timeZoneOptions = [
  { value: 'America/New_York', label: 'New York' },
  { value: 'America/Tegucigalpa', label: 'Tegucigalpa' },
  { value: 'Asia/Manila', label: 'Manila' }
];

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
        {timeZoneOptions.map((zone) => (
          <option key={zone.value} value={zone.value}>
            {zone.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneDropdown;
