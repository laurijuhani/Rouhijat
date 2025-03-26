import BackButton from "./BackButton";
import UserPic from "../auth/UserPic";
import { User } from "@/hooks/useSession";



const UserNavBar = ({ user}: { user: User}) => {
  return (
    <div className="mb-4 flex justify-between w-full bg-gray-800 p-4 rounded-b-lg p-b-4">
        <BackButton />
        <div className="flex items-center ">
          <UserPic />
          <p className="ml-4">{user.name}</p>
        </div>
      </div>
  );
};

export default UserNavBar;
