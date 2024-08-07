import { Button } from '@/components/Button';
import { useState } from 'react';
import { Backend_URL } from '@/lib/Constants';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { formatTimeForTimeZone } from '@/lib/Timezone';
import OvertimeRequestForm from './OvertimeRequestForm';
import Modal from '@/components/Modal';

export const TimeInButton = ({
	userId,
	userTimezone,
	scheduledStart,
	hasTimeInToday,
	disabled,
}: {
	userId: string;
	userTimezone: string;
	scheduledStart: string;
	hasTimeInToday: boolean;
	disabled: boolean;
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [timeInDone, setTimeInDone] = useState(hasTimeInToday);

	const [isEarly, setIsEarly] = useState(false);
	const router = useRouter();

	const currentTime = new Date();
	const formattedCurrentTime = formatTimeForTimeZone(
		currentTime,
		userTimezone
	);

	const handleTimeIn = async () => {
		if (loading || timeInDone) return;
		setLoading(true);
		setError(null);
		// Get the scheduled start time in the user's timezone
		const scheduledStartTime = new Date(scheduledStart);
		const formattedScheduledStartTime = formatTimeForTimeZone(
			scheduledStartTime,
			userTimezone
		);

		// Extract hours and minutes from the formatted times
		const [currentHours, currentMinutes] = formattedCurrentTime
			.split(/:| /)
			.map(Number);
		const [scheduledHours, scheduledMinutes] = formattedScheduledStartTime
			.split(/:| /)
			.map(Number);

		// Convert times to total minutes since midnight
		const currentTotalMinutes =
			(currentHours % 12 || 12) * 60 + currentMinutes;
		const scheduledTotalMinutes =
			(scheduledHours % 12 || 12) * 60 + scheduledMinutes;

		// Determine if the user is late
		const isLate = currentTotalMinutes > scheduledTotalMinutes;
		const isEarly = scheduledTotalMinutes - currentTotalMinutes > 10;

		if (isEarly) {
			setIsEarly(true);
			setIsModalOpen(true);
			setLoading(false);
			return;
		}

		try {
			const session = await getSession();
			const response = await fetch(`${Backend_URL}/attendance`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					timeIn: new Date().toISOString(),
					isLate: isLate,
					isAbsent: false,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to Time In');
			}
			setTimeInDone(true);

			router.refresh();
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleOvertimeSubmit = async (hours: number) => {
		try {
			const session = await getSession();
			const response = await fetch(`${Backend_URL}/overtime-request`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					hours,
					type: 'PRE_SHIFT',
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(
					data.error || 'Failed to create overtime request'
				);
			}

			router.refresh();
			setIsModalOpen(false);
		} catch (error) {
			setError((error as Error).message);
		}
	};

	return (
		<div className="flex flex-col items-center">
			{error && <p className="text-red-500 mb-2">{error}</p>}
			<Button
				variant="success"
				className="w-1/2"
				onClick={handleTimeIn}
				disabled={loading || timeInDone || disabled}>
				{loading ? 'Processing...' : 'Time In'}
			</Button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<OvertimeRequestForm
					userId={userId}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleOvertimeSubmit}
					isEarly={isEarly}
				/>
			</Modal>
		</div>
	);
};
