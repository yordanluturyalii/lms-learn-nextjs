import ShinyButton from "@/components/magicui/shiny-button"
import Image from "next/image"
import Link from "next/link";

const Navbar = () => {
    return (
        <div className="flex items-center justify-between w-full px-4 py-2 bg-background md:px-[10%]">
            <Image src={'/logo-landing-page.svg'} alt={"logo"} height={130} width={130} />
            <a className="no-underline" href={"/home"}>
                <ShinyButton text="Sign In" />
            </a>
        </div>
    )
}

export default Navbar
