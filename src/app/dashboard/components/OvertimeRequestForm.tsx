"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Backend_URL } from "@/lib/Constants";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const OvertimeRequestForm = ({ userId }: { userId: string }) => {
  const [hours, setHours] = useState<number>(0);
  const [type, setType] = useState<string>("PRE_SHIFT");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await getSession();
      const response = await fetch(`${Backend_URL}/overtime-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          hours,
          type,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create overtime request");
      }

      alert("Overtime request submitted successfully!");
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg mb-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Request Overtime</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hours
          </label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3"
          >
            <option value="PRE_SHIFT">Pre-Shift</option>
            <option value="POST_SHIFT">Post-Shift</option>
          </select>
        </div>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <Button
          variant="success"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
};

export default OvertimeRequestForm;
