import { Button } from '@/components/Button';
import { useState } from 'react';
import { SERVER_URL } from '@/lib/Constants';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

export const TimeOutButton = ({
	attendanceId,
	hasTimeOutToday,
	disabled,
}: {
	attendanceId: string;
	hasTimeOutToday: boolean;
	disabled: boolean;
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [timeOutDone, setTimeOutDone] = useState(hasTimeOutToday);
	const router = useRouter();

	const handleTimeOut = async () => {
		if (loading || timeOutDone) return;
		setLoading(true);
		setError(null);

		try {
			const session = await getSession();
			const response = await fetch(
				`${SERVER_URL}/attendance/${attendanceId}`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${session?.backendTokens.accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						timeOut: new Date().toISOString(),
					}),
				}
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to Time Out');
			}

			setTimeOutDone(true);
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
				onClick={handleTimeOut}
				disabled={loading || timeOutDone || disabled}>
				{loading ? 'Processing...' : 'Time Out'}
			</Button>
		</div>
	);
};
