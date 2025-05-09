import { useNavigate } from "react-router-dom";
import RangeSlider from "../../components/plugins/RangeSlider";

const Allocation = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center lg:items-start justify-center  p-4 lg:pt-36 lg:px-4">
			<div className="max-w-[593px] w-full bg-[#12151a] rounded-xl py-6">
				<div className="max-w-[472px] mx-auto px-6">
					<div className="flex flex-col items-start w-full">
						<div
							className="my-4 flex items-center gap-2 px-2"
							onClick={() => navigate(-1)}
							style={{ cursor: "pointer" }}
						>
							<img src="/round-arrow.svg" alt="back" className="w-5 h-5" />
							<span className="font-semibold text-white">Bank</span>
						</div>

						<div className="">
							<p className="font-semibold mb-1 text-white tracking-wider">
								Customize order Volume per User
							</p>
						</div>

						<div className="my-4">
							<RangeSlider
								min={0}
								max={10000}
								initialMin={200}
								initialMax={8600}
								onChange={({ min, max }) =>
									console.log("Range:", min, "-", max)
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Allocation;
