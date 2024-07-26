"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import { Backend_URL } from "@/lib/Constants";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export const TimeInButton = ({
  userId,
  hasTimeInToday,
}: {
  userId: string;
  hasTimeInToday: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTimeIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession();
      const response = await fetch(`${Backend_URL}/attendance/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          timeIn: new Date().toISOString(),
          isLate: false,
          isAbsent: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to Time In");
      }

      alert("Time In successful!");
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Button
        variant="success"
        className="w-1/2"
        onClick={handleTimeIn}
        disabled={hasTimeInToday}
      >
        {loading ? "Processing..." : "Time In"}
      </Button>
    </div>
  );
};
