import { Outlet, useNavigate } from "react-router-dom";
import Dock from "../components/Dock/Dock";
import {
    House,
    Activity,
    Book,
    Search,
} from "lucide-react";

function AppLayout() {
    const navigate = useNavigate();

    const items = [
        {
            label: "Dashboard",
            icon: <House size={22} className="text-zinc-600"/>,
            onClick: () => navigate("/"),
        },
        {
            label: "Activity",
            icon: <Activity size={22} className="text-zinc-600"/>,
            onClick: () => navigate("/activity"),
        },
        {
            label: "Repos",
            icon: <Book size={22} className="text-zinc-600"/>,
            onClick: () => navigate("/repos"),
        },
        {
            label: "Analyze",
            icon: <Search size={22} className="text-zinc-600"/>,
            onClick: () => navigate("/analyze"),
        },
    ];

    return (
        <div className="min-h-screen">
            <main>
                <Outlet />
            </main>

            <Dock items={items} />
        </div>
    );
}

export default AppLayout;