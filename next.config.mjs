/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  remotePatterns: [
		{
		  protocol: 'https',
		  hostname: 's3icepaeopzvrhnp.public.blob.vercel-storage.com',
		  pathname: '/**',
		},
	  ],
	},
  };
  
  export default nextConfig;