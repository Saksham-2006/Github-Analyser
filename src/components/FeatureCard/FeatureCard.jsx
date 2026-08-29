import { ArrowUpRight } from "lucide-react";
function FeatureCard({
    icon,
    title,
    description,
    color = "#5227FF",
}) {
    return (
        <div
            className="group flex flex-col border border-white/10 bg-[#181818] p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
                "--card-color": color,
            }}
        >
            {/* Icon */}
            <div
                className="flex h-8 items-center"
                style={{ color: "var(--card-color)" }}
            >
                {icon}
            </div>

            {/* Content */}
            <div className="flex justify-between items-center">
                <div className="mt-5">
                    <h3 className="text-base font-medium text-white">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {description}
                    </p>
                </div>
                <ArrowUpRight
                    size={16}
                    className="text-gray-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gray-300"
                />
            </div>
        </div>
    );
}

export default FeatureCard;