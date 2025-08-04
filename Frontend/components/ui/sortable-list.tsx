"use client"

// npx shadcn-ui@latest add checkbox
// npm  i react-use-measure
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import {
  AnimatePresence,
  LayoutGroup,
  Reorder,
  motion,
  useDragControls,
} from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"
import { BlogPost } from "@/types/database_types";
import Blog from "../blogs/Blog"

interface SortableListItemProps {
  blog: BlogPost
  order: number
  onRemoveItem: (id: number) => void
  renderExtra?: (blog: BlogPost) => React.ReactNode
  isExpanded?: boolean
  className?: string
  handleDrag: () => void
}

function SortableListItem({
  blog,
  order,
  onRemoveItem,
  renderExtra,
  handleDrag,
  isExpanded,
  className,
}: SortableListItemProps) {
  const [ref, bounds] = useMeasure()
  const [isDragging, setIsDragging] = useState(false)
  const isDraggable = true; 
  const dragControls = useDragControls()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (event: any) => {
    setIsDragging(true)
    dragControls.start(event, { snapToCursor: true })
    handleDrag()
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div className={cn("", className)} key={blog.id}>
      <div className="flex w-full items-center">
        <Reorder.Item
          value={blog}
          className={cn(
            "relative z-auto grow",
            "cursor-grab",
            !isDragging ? "w-7/10" : "w-full"
          )}
          key={blog.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : undefined,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.4,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.05,
              type: "spring",
              bounce: 0.1,
            },
          }}
          layout
          layoutId={`item-${blog.id}`}
          dragControls={dragControls}
          onDragEnd={handleDragEnd}
          style={
            isExpanded
              ? {
                  zIndex: 9999,
                  marginTop: 10,
                  marginBottom: 10,
                  position: "relative",
                  overflow: "hidden",
                }
              : {
                  position: "relative",
                  overflow: "hidden",
                }
          }
          whileDrag={{ zIndex: 9999 }}
        >
          <div ref={ref} className={cn(isExpanded ? "" : "", "z-20 ")}>
            <motion.div
              layout="position"
              className="flex items-center justify-center "
            >
              <AnimatePresence>
                {!isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.001 }}
                    className="flex flex-col  items-center space-y-1 mb-2"
                  >
                    {/* List Order */}
                    <p className="font-mono text-xs pl-1 text-white/50">
                      {order + 1}
                    </p>

                   <Blog blog={blog} handleDelete={() => onRemoveItem(blog.id)} />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* List Item Children */}
              {renderExtra && renderExtra(blog)}
            </motion.div>
          </div>
          <div
            onPointerDown={isDraggable ? handleDragStart : undefined}
            style={{ touchAction: "none" }}
          />
        </Reorder.Item>
      </div>
    </motion.div>
  )
}

SortableListItem.displayName = "SortableListItem"

interface SortableListProps {
  blogs: BlogPost[]
  setItems: Dispatch<SetStateAction<BlogPost[]>>
  handleDelete: (id: number) => Promise<void>
  renderItem: (
    blog: BlogPost,
    order: number,
    onRemoveItem: (id: number) => void
  ) => ReactNode
}

function SortableList({
  blogs,
  setItems,
  handleDelete,
  renderItem,
}: SortableListProps) {
  if (blogs) {
    return (
      <LayoutGroup>
        <Reorder.Group
          axis="y"
          values={blogs}
          onReorder={setItems}
          className="flex flex-col"
        >
          <AnimatePresence>
            {blogs?.map((blog, index) =>
              renderItem(blog, index, (id: number) => handleDelete(id))
            )}
          </AnimatePresence>
        </Reorder.Group>
      </LayoutGroup>
    )
  }
  return null
}

SortableList.displayName = "SortableList"

export { SortableList, SortableListItem }
export default SortableList
