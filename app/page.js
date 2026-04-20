// export default function Home() {
//   return (
//     <main className="flex items-center justify-center h-screen bg-black text-white">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">
//           AI Assistant 🚀
//         </h1>
//         <p className="text-gray-400">
//           Your own ChatGPT-like app
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#f5ebe0] via-[#e3d5ca] to-[#d6ccc2]">
      
      <h1 className="text-5xl font-bold text-[#3a2e2a] mb-6">
        AI Assistant
      </h1>

      <p className="text-lg text-[#5c4a45] mb-10 text-center max-w-md">
        Your smart assistant with real-time knowledge. Ask anything, anytime.
      </p>

      <button
        onClick={() => router.push("/chat")}
        className="px-8 py-3 rounded-2xl bg-[#b5838d] text-white text-lg shadow-lg hover:bg-[#a16a75] transition-all duration-300"
      >
        Start Chat →
      </button>
    </div>
  );
}