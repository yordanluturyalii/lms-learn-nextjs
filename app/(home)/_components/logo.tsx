import Image from "next/image";

export const Logo = () => {
  return (
      <Image src={'/logo.svg'} alt={"logo"} height={130} width={130}/>
  )
}