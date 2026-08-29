import { useState } from "react";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Bot,
} from "lucide-react";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm your GitHub Analyzer AI. Ask me anything about GitHub, repositories, commits, or developer activity.",
        },
    ]);

    const API_URL = import.meta.env.VITE_API_URL;

    const sendMessage = async (e) => {
        e.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) return;

        // Add user's message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: trimmedMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to get AI response."
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: result.data.reply,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        error.message ||
                        "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden border border-neutral-700 bg-[#0d0d0f] shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5227FF]">
                                <Bot size={18} className="text-white" />
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-white">
                                    GitHub AI
                                </h3>

                                <p className="text-xs text-neutral-500">
                                    AI Developer Assistant
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-neutral-500 transition hover:text-white"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-[#5227FF] text-white"
                                            : "border border-neutral-700 bg-neutral-900 text-neutral-300"
                                        }`}
                                >
                                    {msg.content}
                                </div>

                            </div>
                        ))}

                        {/* LOADING */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-400">
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Thinking...
                                </div>
                            </div>
                        )}

                    </div>

                    {/* INPUT */}
                    <form
                        onSubmit={sendMessage}
                        className="border-t border-neutral-700 p-3"
                    >
                        <div className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-2">

                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Ask anything..."
                                disabled={loading}
                                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-neutral-600"
                            />

                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className="flex h-9 w-9 items-center justify-center bg-[#5227FF] text-white transition hover:bg-[#6339ff] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={16} />
                            </button>

                        </div>
                    </form>

                </div>
            )}

            {/* FLOATING BUTTON */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#5227FF] text-white shadow-lg transition hover:scale-105 hover:bg-[#6339ff]"
                aria-label="Open GitHub AI"
            >
                {isOpen ? (
                    <X size={22} />
                ) : (
                    <MessageCircle size={22} />
                )}
            </button>
        </>
    );
}

export default Chatbot;