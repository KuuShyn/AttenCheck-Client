import { formatTime, timeZoneMap } from "@/lib/Timezone";
import { User } from "@/lib/types";

export default function UserProfilePage({ user }: { user: User }) {
  const userTimeZone = timeZoneMap[user.timeZone];

  const formattedScheduledStart = formatTime(user.scheduledStart, userTimeZone);
  const formattedScheduledEnd = formatTime(user.scheduledEnd, userTimeZone);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-b from-white to-slate-200 text-slate-600 text-center p-4 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-semibold">User Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-900 text-lg">{user.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900 text-lg">{user.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Time Zone:</span>
            <span className="text-gray-900 text-lg">{user.timeZone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Scheduled Start:</span>
            <span className="text-gray-900 text-lg">
              {formattedScheduledStart}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Scheduled End:</span>
            <span className="text-gray-900 text-lg">
              {formattedScheduledEnd}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
