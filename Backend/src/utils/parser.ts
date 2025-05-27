import path from "path";
import fs from "fs";
import logger from "./logger";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import { Buffer } from "buffer";
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

const parseProfileData = async (profile: ProfileData): Promise<Profile> => {

  const profilePic = await downloadMedia(profile.profile_pic_url_hd, 'profile_pic.jpg');

  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    profile_pic_url: profilePic || profile.profile_pic_url,
    profile_pic_url_hd: profilePic || profile.profile_pic_url_hd,
    biography: profile.biography,
    category_name: profile.category_name,
    followers: profile.edge_followed_by.count,
    following: profile.edge_follow.count,
    number_of_posts: profile.edge_owner_to_timeline_media.count,
  };
};

const parsePosts = async (profile: ProfileData): Promise<IGPost[]> => {
  return Promise.all(
    profile.edge_owner_to_timeline_media.edges.map(async (edge: PictureParseData) => {
      let pictures: Picture[] = [];
      let videos: Video[] = [];
      const basicInfo = {
        id: edge.node.id,
        taken_at_timestamp: edge.node.taken_at_timestamp,
        comment_count: edge.node.edge_media_to_comment.count,
        caption: edge.node.edge_media_to_caption.edges.length > 0 ? edge.node.edge_media_to_caption.edges[0].node.text : "",
        likes: edge.node.edge_liked_by.count,
      };

      if (edge.node.edge_sidecar_to_children) {
        for (const [index, childEdge] of edge.node.edge_sidecar_to_children.edges.entries()) {
          const pictureOrVideo = await sortPictureAndVideo(childEdge, index + 1);
          if (childEdge.node.is_video) {
            videos.push(pictureOrVideo as Video);
          } else {
            pictures.push(pictureOrVideo as Picture);
          }
        }
      } else {
        const pictureOrVideo = await sortPictureAndVideo(edge, 1);
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
    })
  );
};


const sortPictureAndVideo = async (data: PictureParseData | PictureEdge, order = 1): Promise<Picture | Video> => {
  const media = await downloadMedia(data.node.display_url, `${data.node.id}.jpg`);

  if (data.node.is_video) {
    const video = await downloadMedia(data.node.video_url!, `${data.node.id}.mp4`);
    return {
      id: data.node.id,
      display_url: media || data.node.display_url,
      video_url: video|| "",
      order: order,
    } as Video;
  } else {
    return {
      id: data.node.id,
      display_url: media || data.node.display_url,
      order: order,
    } as Picture;
  }
};

const downloadMedia = async (url: string, filename: string) => {
  const streamPipeline = promisify(pipeline); 
  const dirPath = path.join(__dirname, "..", "..", "media");
  const filePath = path.join(dirPath, filename);

  if (fs.existsSync(filePath)) {
    return `/media/${filename}`;
  }

  fs.mkdirSync(dirPath, { recursive: true });

  const res = await fetch(url);
  if (!res.ok || !res.body) {
    logger.error(`Failed to download media from ${url}: ${res.statusText}`);
    return null;
  }

  const nodeStream = readableWebStream(res.body); 
  await streamPipeline(nodeStream, fs.createWriteStream(filePath));
  
  return `/media/${filename}`;
};

const readableWebStream = (webStream: ReadableStream<Uint8Array<ArrayBufferLike>>) => {
  const reader = webStream.getReader();

  return new Readable({ 
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    }
  });
};


export const parseInstagramData = async () => {
  const profileData = await parseData();
  if (!profileData) {
    logger.error("Failed to fetch or parse Instagram profile data");
    return null;
  }
  
  const parsedProfile = await parseProfileData(profileData);
  const posts = await parsePosts(profileData);
  return {
    profile: parsedProfile,
    posts: posts,
  };
};