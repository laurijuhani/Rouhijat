import { Profile } from "@/types/database_types";
import Image from "next/image";
import Link from "next/link";

const ProfileView = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex flex-col w-fit mx-auto">
      <div className="flex flex-row mt-8 justify-center">
        <Link href={`https://www.instagram.com/${profile.username}`} target="_blank" rel="noopener noreferrer">
          <Image
            className="rounded-full h-20 w-20 mt-4"
            src={profile.profile_pic_url_hd || profile.profile_pic_url}
            alt={`${profile.username}'s profile picture`}
            width={80}
            height={80}
            />
        </Link>

        <div className="ml-4 flex flex-col justify-center">
          <Link href={`https://www.instagram.com/${profile.username}`} target="_blank" rel="noopener noreferrer">
            <h1 className="text-md font-bold">{profile.full_name}</h1>
            <p className="text-sm text-left hover:text-accent transition-colors duration-300 hover:underline">@{profile.username}</p>
          </Link>
          
          <div className="flex flex-row gap-6 mt-2 ml-4">
            <div className="flex flex-col items-center">
              <span className="font-bold">{profile.number_of_posts}</span>
              <span className="text-xs">{profile.number_of_posts > 1 ? "julkaisua" : "julkaisu"}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{profile.followers}</span>
              <span className="text-xs">seuraajaa</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{profile.following}</span>
              <span className="text-xs">seurannassa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-left  mt-4">
        <p className="text-sm text-gray-400 mt-1">{profile.category_name}</p>
        <p className="whitespace-pre-line text-sm">{profile.biography}</p>
      </div>

    </div>
  );
};

export default ProfileView;
