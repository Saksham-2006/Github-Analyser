import { Outlet, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Dock from "../components/Dock/Dock";
import {
    House,
    Activity,
    Book,
    Search,
    Users,
} from "lucide-react";

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const username = searchParams.get("username");
    const userQuery = username ? `?username=${encodeURIComponent(username)}` : "";

    const isDashboardActive = location.pathname === "/";
    const isActivityActive = location.pathname === "/activity";
    const isReposActive = location.pathname === "/repos";
    const isAnalyzeActive = location.pathname === "/analyze";

    const items = [
        {
            label: "Dashboard",
            icon: (
                <House
                    size={22}
                    className={isDashboardActive ? "text-white" : "text-zinc-600"}
                />
            ),
            onClick: () => navigate(`/${userQuery}`),
        },
        {
            label: "Activity",
            icon: (
                <Activity
                    size={22}
                    className={isActivityActive ? "text-white" : "text-zinc-600"}
                />
            ),
            onClick: () => navigate(`/activity${userQuery}`),
        },
        {
            label: "Analyze",
            icon: (
                <Search
                    size={22}
                    className={isAnalyzeActive ? "text-white" : "text-zinc-600"}
                />
            ),
            onClick: () => navigate("/analyze"),
        },
        {
            label: "Repos",
            icon: (
                <Book
                    size={22}
                    className={isReposActive ? "text-white" : "text-zinc-600"}
                />
            ),
            onClick: () => navigate(`/repos${userQuery}`),
        },
        {
            label: "Compare",
            icon: (
                <Users
                    size={22}
                    className={location.pathname.startsWith("/compare") ? "text-white" : "text-zinc-600"}
                />
            ),
            onClick: () => navigate("/compare"),
        },
    ];

    return (
        <div className="min-h-screen min-w-0">
            <main className="min-w-0">
                <Outlet />
            </main>

            <Dock items={items} />
        </div>
    );
}

export default AppLayout;