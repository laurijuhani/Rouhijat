import { IGPost } from "@/types/database_types";
import { HeartIcon, MessageCircleIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { formatInstagramDate } from "@/utils/dateparser";
import FullPost from "./FullPost";

const Post = ({ post }: { post: IGPost }) => {
  const firstImageUrl = () => {
    if (post.pictures && post.pictures.length > 0 && post.pictures[0].order === 1) {
      return post.pictures[0].display_url;
    }
    return post.videos && post.videos.length > 0 ? post.videos[0].display_url : "";
  };

  if (!post || !post.pictures || post.pictures.length === 0) {
    return null; // Don't render anything if there's no post or pictures
  }

  if (!firstImageUrl()) {
    return null; // Don't render if there's no valid image URL
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Image
            src={process.env.NEXT_PUBLIC_PRIVATE_BACKEND_URL + firstImageUrl()}
            alt="Instagram post image"
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center">
                <HeartIcon className="h-5 w-5 mr-1 fill-white stroke-none" />
                <span className="font-medium">{post.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircleIcon className="h-5 w-5 mr-1" />
                <span className="font-medium">{post.comment_count}</span>
              </div>
            </div>
            <span className="mt-3 flex items-center text-white text-xs hover:underline">
              <ExternalLinkIcon className="h-3 w-3 mr-1" />
              <span>Lisää</span>
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-full max-h-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <Image src="/icons/back.svg" alt="Back" width={15} height={15} />
              Takaisin
            </Button>
          </DialogClose>
        </DialogTitle>
        <DialogDescription>
          Julkaistu: {formatInstagramDate(post.taken_at_timestamp)}
        </DialogDescription>
       
        <FullPost
          pictures={post.pictures}
          videos={post.videos}
          likes={post.likes}
          comment_count={post.comment_count}
          caption={post.caption} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default Post;
