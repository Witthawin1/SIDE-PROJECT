import Card from "../../components/Card";
import FilterBar from "../../components/FilterBar";
import Header from "../../components/Header";
import InputWithButton from "@/components/InputWithButton";
export default function Page() {
  return (
    <div>
      <Header />
      <div className="flex justify-center py-4 w-full max-w-[70vw] mx-auto">
        <InputWithButton/>
      </div>
      <div className="flex flex-row justify-between items-center p-4">
        <div className="">
          <FilterBar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 p-4">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  )}