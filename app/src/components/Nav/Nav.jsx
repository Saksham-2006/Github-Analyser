import github from "../../assets/github.svg";

function Nav({ user }) {
    const displayName = user ? (user.name || user.login || "The Octocat") : "The Octocat";

    return (
        <div className="flex justify-between items-center gap-3 min-w-0">
            <div className="flex items-center min-w-0">
                <img src={github} alt="github" width="30" className="mr-3 sm:mr-5 shrink-0" />
                <h1 className="text-sm sm:text-lg lg:text-2xl text-white font-bold tracking-wider truncate">GITHUB ANALYTICS</h1>
            </div>
            <p className="text-sm sm:text-lg lg:text-2xl underline text-white font-mono truncate max-w-[40%] sm:max-w-[50%] text-right">{displayName}</p>
        </div>
    );
}

export default Nav;
