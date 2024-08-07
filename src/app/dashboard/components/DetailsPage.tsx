'use client';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { TimeInButton } from './TimeInButton';
import { TimeOutButton } from './TimeOutButton';
import TimezoneDropdown from './TimeZoneDropDown';
import { SERVER_URL } from '@/lib/Constants';
import { getSession } from 'next-auth/react';
import { Button } from '@/components/Button';
import Modal from '@/components/Modal';
import OvertimeRequestForm from './OvertimeRequestForm';
import { formatDateForTimeZone } from '@/lib/Timezone';

export default function DetailsPage({ user }: { user: User }) {
	const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
		user.timeZone
	);
	const [hasTimeInToday, setHasTimeInToday] = useState<boolean>(false);
	const [hasTimeOutToday, setHasTimeOutToday] = useState<boolean>(false);
	const [loadingTimeInStatus, setLoadingTimeInStatus] =
		useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchStatus = async () => {
			const session = await getSession();
			try {
				const timeInResponse = await fetch(
					`${SERVER_URL}/attendance/check-time-in/${user.id}?timezone=${user.timeZone}`,
					{
						headers: {
							Authorization: `Bearer ${session?.backendTokens.accessToken}`,
							'Content-Type': 'application/json',
						},
					}
				);
				console.log('Time in Response:', timeInResponse);
				if (!timeInResponse.ok) {
					throw new Error('Failed to fetch time-in status');
				}
				const timeInData = await timeInResponse.json();
				// console.log(timeInData);
				setHasTimeInToday(timeInData);

				const timeOutResponse = await fetch(
					`${SERVER_URL}/attendance/check-time-out/${user.id}?timezone=${user.timeZone}`,
					{
						headers: {
							Authorization: `Bearer ${session?.backendTokens.accessToken}`,
							'Content-Type': 'application/json',
						},
					}
				);
				if (!timeOutResponse.ok) {
					throw new Error('Failed to fetch time-out status');
				}
				const timeOutData = await timeOutResponse.json();
				setHasTimeOutToday(timeOutData);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoadingTimeInStatus(false);
			}
		};

		fetchStatus();
	}, [user.id, user.timeZone]);

	const handleTimeZoneChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSelectedTimeZone(event.target.value);
	};

	const attendanceId = user.attendances.slice(-1)[0]?.id;

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	return (
		<div className="container mx-auto p-4 md:p-8">
			<div className="bg-gradient-to-b from-white to-slate-200 text-slate-600 text-center p-4 rounded-t-lg shadow-md mb-6">
				<h1 className="text-3xl font-bold">User Details</h1>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				{/* Timezone Dropdown */}
				<div className="mb-6">
					<TimezoneDropdown
						selectedTimeZone={selectedTimeZone}
						handleTimeZoneChange={handleTimeZoneChange}
					/>
				</div>

				{/* Attendance */}
				<h2 className="text-2xl font-semibold mb-4">Attendance</h2>
				{loadingTimeInStatus ? (
					<div className="flex justify-center items-center py-4">
						<svg
							className="animate-spin h-8 w-8 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 0115.99 1.12A4.97 4.97 0 0012 4v4l-2-2-2 2V4a8 8 0 000 8z"></path>
						</svg>
					</div>
				) : error ? (
					<div className="text-red-500 text-center py-4">
						<p>{error}</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Time In
									</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Time Out
									</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Is Late
									</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Is Absent
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{user.attendances.map((attendance) => (
									<tr key={attendance.id}>
										<td className="px-4 py-2 whitespace-nowrap">
											{attendance.timeIn
												? formatDateForTimeZone(
														new Date(
															attendance.timeIn
														),
														selectedTimeZone
													)
												: 'N/A'}
										</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{attendance.timeOut
												? formatDateForTimeZone(
														new Date(
															attendance.timeOut
														),
														selectedTimeZone
													)
												: 'N/A'}
										</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{attendance.isLate ? 'Yes' : 'No'}
										</td>
										<td className="px-4 py-2 whitespace-nowrap">
											{attendance.isAbsent ? 'Yes' : 'No'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Your Overtime Request */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<h2 className="text-2xl font-semibold mb-4">
					Your Overtime Request
				</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Hours
								</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created At
								</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Updated At
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{user.overtimeRequests.map((otr) => (
								<tr key={otr.id}>
									<td className="px-4 py-2 whitespace-nowrap">
										{otr.hours}
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{otr.type}
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{otr.status}
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{formatDateForTimeZone(
											new Date(otr.createdAt),
											selectedTimeZone
										)}
									</td>
									<td className="px-4 py-2 whitespace-nowrap">
										{formatDateForTimeZone(
											new Date(otr.updatedAt),
											selectedTimeZone
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex gap-4 justify-center">
					<TimeInButton
						userId={user.id}
						userTimezone={user.timeZone}
						scheduledStart={user.scheduledStart}
						hasTimeInToday={hasTimeInToday}
						disabled={hasTimeInToday} // Disable TimeInButton if time in is done
					/>
					<TimeOutButton
						attendanceId={attendanceId}
						hasTimeOutToday={hasTimeOutToday}
						disabled={hasTimeOutToday} // Disable TimeOutButton if time out is done
					/>
				</div>
				<div>
					<Button variant="primary" onClick={handleOpenModal}>
						Request Overtime
					</Button>
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<OvertimeRequestForm
					userId={user.id}
					onClose={handleCloseModal}
					onSubmit={function (hours: number): Promise<void> {
						return new Promise((resolve) => {
							resolve();
						});
					}}
					isEarly={false}
				/>
			</Modal>
		</div>
	);
}
