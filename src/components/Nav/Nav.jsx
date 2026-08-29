import github from "../../assets/github.svg";

function Nav() {
    return (
        <div className="flex justify-between">
            <div className="flex">
                <img src={github} alt="github" width="30" className="mr-5" />
                <h1 className="text-2xl text-white font-bold">GITHUB ANALYTICS</h1>
            </div>
            <p className="text-3xl text-white font-light">The Octocat</p>
        </div>
    )
}

export default Nav
