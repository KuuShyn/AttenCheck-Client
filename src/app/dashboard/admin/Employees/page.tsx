'use client';

import { useEffect, useState } from 'react';
import { Backend_URL } from '@/lib/Constants';
import { User } from '@/lib/types';
import { getSession } from 'next-auth/react';

const Employees = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	useEffect(() => {
		const fetchData = async (page: number) => {
			try {
				const session = await getSession();
				if (session && session.backendTokens) {
					const response = await fetch(
						`${Backend_URL}/users?page=${page}&limit=10`,
						{
							method: 'GET',
							headers: {
								authorization: `Bearer ${session.backendTokens.accessToken}`,
								'Content-Type': 'application/json',
							},
						}
					);

					if (response.ok) {
						const {
							users: userData,
							meta,
						}: {
							users: User[];
							meta: { pageCount: number; currentPage: number };
						} = await response.json();
						setUsers(userData);
						setTotalPages(meta.pageCount);
						setCurrentPage(meta.currentPage);
					} else {
						console.error('Failed to fetch users');
					}
				}
			} catch (error) {
				console.error('An error occurred while fetching users:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData(currentPage);
	}, [currentPage]);

	if (loading) {
		return <div className="text-center py-4">Loading...</div>;
	}

	if (users.length === 0) {
		return <div className="text-center py-4">No users found</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Employee List</h1>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200">
					<thead>
						<tr className="bg-gray-100 border-b">
							<th className="py-2 px-4 text-left text-gray-600">
								Name
							</th>
							<th className="py-2 px-4 text-left text-gray-600">
								Email
							</th>
							<th className="py-2 px-4 text-left text-gray-600">
								Time Zone
							</th>
							<th className="py-2 px-4 text-left text-gray-600">
								Role
							</th>
							<th className="py-2 px-4 text-left text-gray-600">
								Scheduled Start
							</th>
							<th className="py-2 px-4 text-left text-gray-600">
								Scheduled End
							</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr
								key={user.id}
								className="border-b hover:bg-gray-50">
								<td className="py-2 px-4 text-gray-800">
									{user.name}
								</td>
								<td className="py-2 px-4 text-gray-800">
									{user.email}
								</td>
								<td className="py-2 px-4 text-gray-800">
									{user.timeZone}
								</td>
								<td className="py-2 px-4 text-gray-800">
									{user.role}
								</td>
								<td className="py-2 px-4 text-gray-800">
									{new Date(
										user.scheduledStart
									).toLocaleString()}
								</td>
								<td className="py-2 px-4 text-gray-800">
									{new Date(
										user.scheduledEnd
									).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center mt-4">
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.max(prev - 1, 1))
					}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					disabled={currentPage === 1}>
					Previous
				</button>
				<span className="text-gray-600">
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</div>
	);
};

export default Employees;
