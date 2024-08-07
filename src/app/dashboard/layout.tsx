import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';


type Props = {
	children: React.ReactNode;
};

const DashBoardLayout = async (props: Props) => {
	const session = await getServerSession(authOptions);

	return (
		<div className="flex min-h-screen">
			<div className="w-64 bg-gray-800 text-white p-4 shadow-lg">
				<div className="flex flex-col items-center mb-6">
					<div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold">
						{session?.user.name.charAt(0)}
					</div>
					<h2 className="mt-4 text-xl font-semibold">
						{session?.user.name}
					</h2>
					<h2 className="mt-4 text-xl font-semibold">
						{session?.user.role}
					</h2>
				</div>
				<nav className="flex flex-col space-y-2">
					<Link
						className="p-3 rounded bg-gray-700 hover:bg-emerald-600 hover:shadow transition"
						href={`/dashboard/profile/${session?.user.id}`}
						aria-label="User Profile">
						User Profile
					</Link>
					<Link
						className="p-3 rounded bg-gray-700 hover:bg-emerald-600 hover:shadow transition"
						href={`/dashboard/details/${session?.user.id}`}
						aria-label="Time in / out">
						Time in / out
					</Link>
					{session?.user.role === 'ADMIN' && (
						<>
							<Link
								className="p-3 rounded bg-gray-700 hover:bg-emerald-600 hover:shadow transition"
								href={`/dashboard/admin/ot-request/`}
								aria-label="Overtime Request">
								OT Requests
							</Link>

							<Link
								className="p-3 rounded bg-gray-700 hover:bg-emerald-600 hover:shadow transition"
								href={`/dashboard/admin/Employees/`}
								aria-label="Employees">
								Employees
							</Link>

							<Link
								href={'/dashboard/admin/create-user'}
								className="flex gap-4 ml-auto bg-green-600 text-green-200 p-2 rounded">
								Create Employee
							</Link>


						</>
					)}
				</nav>
			</div>
			<div className="flex-grow p-4">{props.children}</div>
		</div>
	);
};

export default DashBoardLayout;
