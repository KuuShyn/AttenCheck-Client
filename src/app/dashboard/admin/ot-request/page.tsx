
import { Backend_URL } from '@/lib/Constants';
import { User } from '@/lib/types';
import { getServerSession } from 'next-auth';
import RequestPage from './components/RequestPage';
import { authOptions } from '@/lib/auth';

const AdminServerSession = async () => {
	const session = await getServerSession(authOptions);
	const response = await fetch(`${Backend_URL}/users/overtime`, {
		method: 'GET',
		headers: {
			authorization: `Bearer ${session?.backendTokens.accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	const user: User[] = await response.json();

	return <RequestPage users={user}></RequestPage>;
};

export default AdminServerSession;
