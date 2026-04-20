// "use client";

// import { useState, useRef, useEffect } from "react";

// export default function ChatPage() {
//   const [chats, setChats] = useState([
//     {
//       id: 1,
//       messages: [
//         { role: "assistant", content: "Hello 👋 How can I help you?" },
//       ],
//     },
//   ]);

//   const [activeChatId, setActiveChatId] = useState(1);
//   const [chatId, setChatId] = useState(null); // ✅ backend chatId
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const bottomRef = useRef(null);

//   const activeChat = chats.find((chat) => chat.id === activeChatId);

//   // Auto scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chats, loading]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userInput = input; // ✅ FIX
//     const userMessage = { role: "user", content: userInput };

//     // Add user message instantly
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === activeChatId
//           ? { ...chat, messages: [...chat.messages, userMessage] }
//           : chat
//       )
//     );

//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: userInput,
//           chatId, // ✅ FIX
//         }),
//       });
//       const text = await res.text();
//       console.log("API RESPONSE:", text);

//       const data = JSON.parse(text);

//       // const data = await res.json();
//       setLoading(false);

//       // ✅ Save backend chatId
//       if (data.chatId) {
//         setChatId(data.chatId);
//       }

//       // ✅ Sync messages with backend (IMPORTANT)
//       if (data.messages) {
//         setChats((prevChats) =>
//           prevChats.map((chat) =>
//             chat.id === activeChatId
//               ? { ...chat, messages: data.messages }
//               : chat
//           )
//         );
//       }
//       // FOR TITLE
//       if (data.title) {
//         setChats((prevChats) =>
//           prevChats.map((chat) =>
//             chat.id === activeChatId
//               ? { ...chat, title: data.title || chat.title }
//               : chat
//           )
//         );
//       }

//       // Typing effect (optional enhancement)
//       if (!data.messages) {
//         let messageIndex;

//         setChats((prevChats) =>
//           prevChats.map((chat) => {
//             if (chat.id === activeChatId) {
//               messageIndex = chat.messages.length;
//               return {
//                 ...chat,
//                 messages: [
//                   ...chat.messages,
//                   { role: "assistant", content: "" },
//                 ],
//               };
//             }
//             return chat;
//           })
//         );

//         const replyText = data.reply || "Sorry, something went wrong";
//         const words = replyText.split(" ");

//         let currentText = "";

//         for (let i = 0; i < words.length; i++) {
//           await new Promise((res) => setTimeout(res, 30));

//           currentText += words[i] + " ";

//           setChats((prevChats) =>
//             prevChats.map((chat) => {
//               if (chat.id === activeChatId) {
//                 const updatedMessages = [...chat.messages];
//                 updatedMessages[messageIndex] = {
//                   role: "assistant",
//                   content: currentText,
//                 };
//                 return { ...chat, messages: updatedMessages };
//               }
//               return chat;
//             })
//           );
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-[#eeeeaf] text-[#3b3b39]">

//       {/* Mobile Header with Menu */}
//       <div className="md:hidden flex items-center justify-between p-3 border-b border-[#75736d]">
//         <button onClick={() => setOpen(!open)}>☰</button>
//         <div className="font-serif text-[#6b5e57]">Your Buddy - AI Assistant</div>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`fixed md:static top-0 left-0 h-full z-50 w-64 p-4 bg-[#f5f2e6] border-r border-[#7c7a6e] transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
//           } md:translate-x-0`}
//       >
//         <button
//           className="w-full mb-4 bg-[#d8a48f] text-white py-2 rounded-xl hover:bg-[#c07559] transition shadow-sm"
//           onClick={() => {
//             const newChat = {
//               id: Date.now(),
//               messages: [
//                 {
//                   role: "assistant",
//                   content: "Hello 👋 How can I help you?",
//                 },
//               ],
//             };

//             setChats((prev) => [...prev, newChat]);
//             setActiveChatId(newChat.id);
//             setChatId(null);
//             setOpen(false); // close sidebar on mobile
//           }}
//         >
//           + New Chat
//         </button>

//         <div className="space-y-2">
//           {chats.map((chat) => (
//             <div
//               key={chat.id}
//               onClick={() => {
//                 setActiveChatId(chat.id);
//                 setOpen(false); // close on select (mobile)
//               }}
//               className={`p-2 rounded cursor-pointer ${chat.id === activeChatId
//                 ? "bg-gray-300"
//                 : "hover:bg-olive-500"
//                 }`}
//             >
//               {chat.title || "New Chat"}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Overlay (mobile only) */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/30 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Main Chat */}
//       <div className="flex flex-col flex-1 h-screen">

//         {/* Header (desktop only) */}
//         <div className="hidden md:block p-4 border-b font-serif border-[#75736d] text-center text-[#6b5e57]">
//           Your Buddy - AI Assistant
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4">
//           <div className="max-w-3xl mx-auto w-full">
//             {activeChat.messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
//                   }`}
//               >
//                 <div
//                   className={`px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[70%] shadow-sm ${msg.role === "user"
//                     ? "bg-[#d8a48f] text-white"
//                     : "bg-white border border-[#e5e2da] text-[#3e3e3e]"
//                     }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm md:text-base">
//                     {msg.content}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-[#e5e2da] px-4 py-2 rounded-2xl text-sm text-gray-500">
//                   AI is typing...
//                 </div>
//               </div>
//             )}

//             <div ref={bottomRef} />
//           </div>
//         </div>

//         {/* Input */}
//         <div className="p-3 md:p-4 border-t border-[#e0ddd5] bg-[#f5f5f0]">
//           <div className="max-w-3xl mx-auto flex items-center gap-2 bg-white border border-[#ddd] rounded-xl px-3 py-2 shadow-sm">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") sendMessage();
//               }}
//               placeholder="Ask anything..."
//               className="flex-1 bg-transparent outline-none text-sm md:text-base"
//             />

//             <button
//               onClick={sendMessage}
//               className="bg-[#6b5e57] text-white px-3 md:px-4 py-1.5 rounded-lg hover:bg-[#5a4f49]"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [
        { role: "assistant", content: "Hello 👋 How can I help you?" },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // ✅ FIX

  const bottomRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;
    const userMessage = { role: "user", content: userInput };

    // Add user message instantly
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          chatId,
        }),
      });

      let data;
      try {
        data = await res.json(); // ✅ safer
      } catch {
        throw new Error("Invalid JSON");
      }

      setLoading(false);

      // ✅ FALLBACK MODE (DB OFF)
      if (data.fallback) {
        const replyText = data.reply || "⚠️ Offline mode";

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { role: "assistant", content: replyText },
                  ],
                }
              : chat
          )
        );

        // Save locally
        const localChats =
          JSON.parse(localStorage.getItem("chats")) || [];

        localChats.push(
          { role: "user", content: userInput },
          { role: "assistant", content: replyText }
        );

        localStorage.setItem("chats", JSON.stringify(localChats));

        return;
      }

      // ✅ Normal DB flow
      if (data.chatId) {
        setChatId(data.chatId);
      }

      if (data.messages) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: data.messages }
              : chat
          )
        );
      }

      if (data.title) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, title: data.title }
              : chat
          )
        );
      }

      // Typing effect if only reply
      if (!data.messages && data.reply) {
        let messageIndex;

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === activeChatId) {
              messageIndex = chat.messages.length;
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: "" },
                ],
              };
            }
            return chat;
          })
        );

        const words = data.reply.split(" ");
        let currentText = "";

        for (let i = 0; i < words.length; i++) {
          await new Promise((res) => setTimeout(res, 30));
          currentText += words[i] + " ";

          setChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.id === activeChatId) {
                const updatedMessages = [...chat.messages];
                updatedMessages[messageIndex] = {
                  role: "assistant",
                  content: currentText,
                };
                return { ...chat, messages: updatedMessages };
              }
              return chat;
            })
          );
        }
      }
    } catch (error) {
      console.error(error);

      // ✅ FULL FAILURE FALLBACK
      const reply = "⚠️ Server not responding. Working offline.";

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: reply },
                ],
              }
            : chat
        )
      );

      // Save locally
      const localChats =
        JSON.parse(localStorage.getItem("chats")) || [];

      localChats.push(
        { role: "user", content: userInput },
        { role: "assistant", content: reply }
      );

      localStorage.setItem("chats", JSON.stringify(localChats));

      setLoading(false);
    }
  };

   return (
    <div className="flex flex-col md:flex-row h-screen bg-[#eeeeaf] text-[#3b3b39]">

      {/* Mobile Header with Menu */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-[#75736d]">
        <button onClick={() => setOpen(!open)}>☰</button>
        <div className="font-serif text-[#6b5e57]">Your Buddy - AI Assistant</div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-50 w-64 p-4 bg-[#f5f2e6] border-r border-[#7c7a6e] transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <button
          className="w-full mb-4 bg-[#d8a48f] text-white py-2 rounded-xl hover:bg-[#c07559] transition shadow-sm"
          onClick={() => {
            const newChat = {
              id: Date.now(),
              messages: [
                {
                  role: "assistant",
                  content: "Hello 👋 How can I help you?",
                },
              ],
            };

            setChats((prev) => [...prev, newChat]);
            setActiveChatId(newChat.id);
            setChatId(null);
            setOpen(false); // close sidebar on mobile
          }}
        >
          + New Chat
        </button>

        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setOpen(false); // close on select (mobile)
              }}
              className={`p-2 rounded cursor-pointer ${chat.id === activeChatId
                ? "bg-gray-300"
                : "hover:bg-olive-500"
                }`}
            >
              {chat.title || "New Chat"}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Chat */}
      <div className="flex flex-col flex-1 h-screen">

        {/* Header (desktop only) */}
        <div className="hidden md:block p-4 border-b font-serif border-[#75736d] text-center text-[#6b5e57]">
          Your Buddy - AI Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4">
          <div className="max-w-3xl mx-auto w-full">
            {activeChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 md:mb-3
                   ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[70%] shadow-sm ${msg.role === "user"
                    ? "bg-[#d8a48f] text-white"
                    : "bg-white border border-[#e5e2da] text-[#3e3e3e]"
                    }`}
                >
                  {/* <div className="whitespace-pre-wrap text-sm md:text-base">
                    {msg.content}
                  </div> */}
                  <div className="prose prose-sm md:prose-base max-w-none">
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e5e2da] px-4 py-2 rounded-2xl text-sm text-gray-500">
                  AI is typing...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-[#e0ddd5] bg-[#f5f5f0]">
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-white border border-[#ddd] rounded-xl px-3 py-2 shadow-sm">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
            />

            <button
              onClick={sendMessage}
              className="bg-[#6b5e57] text-white px-3 md:px-4 py-1.5 rounded-lg hover:bg-[#5a4f49]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}