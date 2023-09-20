import Image from "next/image"
import padlock from "../public/padlock-open-svgrepo-com.svg"
export const Padlock=()=>{
    return(
        <Image
        src={padlock}
        width={20}
        height={20}
        alt="padlock"
        />
    )
}