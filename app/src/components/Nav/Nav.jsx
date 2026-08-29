import github from "../../assets/github.svg";

function Nav({ user }) {
    const displayName = user ? (user.name || user.login || "The Octocat") : "The Octocat";

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <img src={github} alt="github" width="30" className="mr-5" />
                <h1 className="text-2xl text-white font-bold tracking-wider">GITHUB ANALYTICS</h1>
            </div>
            <p className="text-3xl text-white font-light">{displayName}</p>
        </div>
    );
}

export default Nav;
