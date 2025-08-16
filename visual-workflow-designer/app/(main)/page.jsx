import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Image from "next/image";

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col h-full">
      <Header></Header>
      <div className="flex flex-row items-center flex-1 h-full">
        <div className="flex flex-col flex-1 gap-2 mx-8 p-4 h-full justify-center">
          <div className="gap-2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Your Design Assistant</h1>
          <p className="">Unlock your creative potential , customize 
            and perfect your designs with cutting with cutting-edge tools.
          </p>
        </div>

        <div className="flex flex-row items-center ">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary ml-4">Learn More</button>
        </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <Image src="../next.svg" alt="Description" objectFit="cover" width={220} height={220} />
        </div>
    </div>
    <Footer></Footer>
    </div>
  )
}
