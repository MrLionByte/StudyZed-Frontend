import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 10 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function BatchMembers() {
  return (
<div className="">
  <ScrollArea className="max-h-[600px] w-full rounded-md border overflow-y-auto">
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
      {tags.map((tag) => (
        <div key={tag}>
          <div className="text-sm">{tag}</div>
          <Separator className="my-2" />
        </div>
      ))}
    </div>
  </ScrollArea>
</div>

  )
}
