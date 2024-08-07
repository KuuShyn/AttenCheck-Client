import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Backend_URL } from "./Constants";

async function refreshToken(token: JWT): Promise<JWT> {
	try {
		const res = await fetch(`${Backend_URL}/auth-v2/refresh`, {
			method: 'POST',
			headers: {
				authorization: `Refresh ${token.backendTokens.refreshToken}`,
			},
		});

		if (!res.ok) {
			throw new Error(`Failed to refresh token: ${res.statusText}`);
		}

		const response = await res.json();

		return {
			...token,
			backendTokens: response.backendTokens,
		};
	} catch (error) {
		console.error('Error refreshing token', error);
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'jsmith',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password)
					return null;

				const { username, password } = credentials;
				const res = await fetch(`${Backend_URL}/auth-v2/login`, {
					method: 'POST',
					body: JSON.stringify({
						username,
						password,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (res.status == 401) return null;

				const user = await res.json();
				return user;
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return { ...token, ...user };
			}

			const currentTime = new Date().getTime();
			if (currentTime < token.backendTokens.expiresIn) {
				return token;
			}

			return await refreshToken(token);
		},

		async session({ session, token }) {
			session.user = token.user;
			session.backendTokens = token.backendTokens;

			return session;
		},
	},

	pages: {
		signIn: '/signin',
		signOut: '/signout',
	},
};
function CredentialsProvider(arg0: { name: string; credentials: { username: { label: string; type: string; placeholder: string; }; password: { label: string; type: string; }; }; authorize(credentials: any): Promise<any>; }): import("next-auth/providers/index").Provider {
    throw new Error("Function not implemented.");
}
