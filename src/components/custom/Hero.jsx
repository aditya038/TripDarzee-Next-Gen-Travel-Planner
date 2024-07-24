import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import heroImg from "@/assets/hero.png"

function Hero() {
    return (
        <div className="flex flex-col items-center mx-56 gap-9">
            <h1 className="font-extrabold text-[60px] text-center mt-16">
                <span className="text-[#BD4A25]">Plan Your Adventure with AI: </span>Personalized Vacation Routes at Your Fingertips
            </h1>
            <p className="text-xl text-gray-500 text-center">Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>

            <Link to={'create-trip'}>
                <Button>Get Started, It&apos;s Free</Button>
            </Link>

            <img src={heroImg} alt="hero img" className="my-20 w-[900px]" />
        </div>
    )
}

export default Hero