import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export default function InputWithButton() {
  return (
    <div className="flex w-[70vw] max-w-3xl items-center gap-2">
      <Input type="email" placeholder="Email" className="w-full h-14 text-lg" />
      <Button type="submit" variant="outline" className="h-14 px-8 text-lg">
        Subscribe
      </Button>
    </div>
  )
}