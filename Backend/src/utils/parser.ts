import logger from "./logger";
import { ProfileData, Picture, PictureEdge, Profile, PictureParseData, IGPost, Video } from "./types";
const profile = process.env.PROFILE_NAME || "";

const parseData = async () => {
  const targetUrl = encodeURIComponent(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${profile}`);
  const response = await fetch(
    `https://api.scrape.do/?token=${process.env.TOKEN}&url=${targetUrl}`,
    {
      headers: {
        "x-ig-app-id": "936619743392459",
        "User-Agent": "Instagram 219.0.0.12.117 (iPhone11,8; iOS 14_4; en_US; en-US; scale=2.00; 828x1792; 272613039)",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "*/*",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://www.instagram.com/",
      }
    }
  ); 
  try {
    const data = await response.json() as { data: { user: ProfileData } };
    return data.data.user; 
  } catch (error) {
    logger.error("Failed to parse profile data:", error);
    return null; 
  }
};

const parseProfileData = (profile: ProfileData): Profile => {
  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    profile_pic_url: profile.profile_pic_url,
    profile_pic_url_hd: profile.profile_pic_url_hd,
    biography: profile.biography,
    category_name: profile.category_name,
    followers: profile.edge_followed_by.count,
    following: profile.edge_follow.count,
    number_of_posts: profile.edge_owner_to_timeline_media.count,
  };
};

const parsePosts = (profile: ProfileData): IGPost[] => {
  return profile.edge_owner_to_timeline_media.edges.map((edge: PictureParseData) => {
    let pictures: Picture[] = [];
    let videos: Video[] = [];
    const basicInfo = {
    id: edge.node.id, // This will be auto-incremented in the database
    taken_at_timestamp: edge.node.taken_at_timestamp,
    comment_count: edge.node.edge_media_to_comment.count,
    caption: edge.node.edge_media_to_caption.edges.length > 0 ? edge.node.edge_media_to_caption.edges[0].node.text : "",
    likes: edge.node.edge_liked_by.count,
  };

  if (edge.node.edge_sidecar_to_children) {
    edge.node.edge_sidecar_to_children.edges.forEach((childEdge: PictureEdge, index: number) => {
      const pictureOrVideo = sortPictureAndVideo(childEdge, index + 1);
      if (childEdge.node.is_video) {
        videos.push(pictureOrVideo as Video);
      } else {
        pictures.push(pictureOrVideo as Picture);
      }
    });
  } else {
    const pictureOrVideo = sortPictureAndVideo(edge, 1);
    if (edge.node.is_video) {
      videos.push(pictureOrVideo as Video);
    } else {
      pictures.push(pictureOrVideo as Picture);
    }
  }


  return {
    ...basicInfo,
    pictures: pictures,
    videos: videos,
  };
  });
};


const sortPictureAndVideo = (data: PictureParseData | PictureEdge, order = 1): Picture | Video => {
  if (data.node.is_video) {
    return {
      id: data.node.id,
      display_url: data.node.display_url,
      video_url: data.node.video_url || "",
      order: order,
    } as Video;
  } else {
    return {
      id: data.node.id,
      display_url: data.node.display_url,
      order: order,
    } as Picture;
  }
};


export const parseInstagramData = async () => {
  const profileData = await parseData();
  if (!profileData) {
    logger.error("Failed to fetch or parse Instagram profile data");
    return null;
  }
  
  const parsedProfile = parseProfileData(profileData);
  const posts = parsePosts(profileData);
  return {
    profile: parsedProfile,
    posts: posts,
  };
};