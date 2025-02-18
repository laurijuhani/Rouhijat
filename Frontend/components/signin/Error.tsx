"use client"
import { useSearchParams } from "next/navigation";
const Error = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  if (!error) {
    return null;
  }



  return (
    <div className="border border-red-500 text-white bg-red-500 p-4 rounded-lg mb-6 w-[90%] max-w-[400px] text-center">
      <p>{message}</p>
    </div>
  )
}

export default Error
