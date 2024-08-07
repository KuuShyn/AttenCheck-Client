import { SERVER_URL } from '@/lib/Constants';
import { getServerSession } from 'next-auth';
import { User } from '@/lib/types';
import DetailsPage from '../../components/DetailsPage';
import { authOptions } from '@/lib/auth';

type Props = {
	params: {
		id: string;
	};
};

const DetailsSession = async (props: Props) => {
	const session = await getServerSession(authOptions);
	const response = await fetch(
		`${SERVER_URL}/users/details/${props.params.id}`,
		{
			method: 'GET',
			headers: {
				authorization: `Bearer ${session?.backendTokens.accessToken}`,
				'Content-Type': 'application/json',
			},
		}
	);

	const user: User = await response.json();

	return <DetailsPage user={user} />;
};

export default DetailsSession;
