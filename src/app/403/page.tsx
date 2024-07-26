import Link from "next/link";

const Custom403 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-700 mb-8">
        You do not have permission to access this page.
      </p>
      <Link href="/" className="text-blue-500 underline">
        Go back to homepage
      </Link>
    </div>
  );
};

export default Custom403;
