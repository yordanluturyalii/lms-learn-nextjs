import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full h-44 relative z-50 bg-zinc-200 flex flex-col md:px-[10%] px-4 py-4 justify-evenly dark:bg-zinc-800">
      <Image src={'/logo-landing-page.svg'} alt={"logo"} height={130} width={130} />
      <p className="text-muted-foreground">© 2024 Eduleap. All rights reserved.</p>
      <Link href={"#"} className="underline">
        Privacy Policy
      </Link>
    </footer>
  )
}

export default Footer
