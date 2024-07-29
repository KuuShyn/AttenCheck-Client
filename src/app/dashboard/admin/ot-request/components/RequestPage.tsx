'use client';

import { Backend_URL } from '@/lib/Constants';
import { User } from '@/lib/types';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RequestsPage = ({ users }: { users: User[] }) => {
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	// Function to handle status change
	const handleStatusChange = async (requestId: string, newStatus: string) => {
		setUpdatingId(requestId);
		try {
			const session = await getSession();
			const response = await fetch(
				`${Backend_URL}/overtime-request/${requestId}`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${session?.backendTokens.accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ status: newStatus }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update status');
			}

			router.refresh();
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold mb-4">
				Overtime Pending Requests
			</h1>
			{error && <div className="text-red-600 mb-4">{error}</div>}
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
					<thead className="bg-gray-200 border-b border-gray-300">
						<tr>
							<th className="py-3 px-6 text-left text-gray-600">
								Name
							</th>
							<th className="py-3 px-6 text-left text-gray-600">
								Hours
							</th>
							<th className="py-3 px-6 text-left text-gray-600">
								Type
							</th>
							<th className="py-3 px-6 text-left text-gray-600">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{users.flatMap((user) =>
							user.overtimeRequests.map((request) => (
								<tr
									key={request.id}
									className="border-b border-gray-300">
									<td className="py-3 px-6 text-gray-800">
										{user.name}
									</td>
									<td className="py-3 px-6 text-gray-800">
										{request.hours}
									</td>
									<td className="py-3 px-6 text-gray-800 capitalize">
										{request.type}
									</td>
									<td className="py-3 px-6">
										<select
											className="bg-gray-50 border border-gray-300 rounded-md py-1 px-2"
											value={request.status}
											onChange={(e) =>
												handleStatusChange(
													request.id,
													e.target.value
												)
											}
											disabled={
												updatingId === request.id
											}>
											<option value="PENDING">
												PENDING
											</option>

											<option value="APPROVED">
												APPROVED
											</option>
											<option value="REJECTED">
												REJECTED
											</option>
										</select>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default RequestsPage;
