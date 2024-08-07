import { useState } from 'react';
import { Button } from '@/components/Button';

const OvertimeRequestForm = ({
	userId,
	onClose,
	onSubmit,
	isEarly,
}: {
	userId: string;
	onClose: () => void;
	onSubmit: (hours: number) => Promise<void>;
	isEarly: boolean;
}) => {
	const [hours, setHours] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await onSubmit(hours);
			onClose();
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg mb-6 max-w-md mx-auto">
			<h2 className="text-2xl font-semibold mb-4">{isEarly ? 'Pre-Shift Overtime' : 'Request Overtime'}</h2>
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
				{error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
				<Button
					variant="success"
					type="submit"
					className="w-full"
					disabled={loading}
				>
					{loading ? 'Submitting...' : 'Submit Request'}
				</Button>
			</form>
		</div>
	);
};

export default OvertimeRequestForm;
