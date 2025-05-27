import prisma from "../utils/client";
import { Profile, IGPost } from "../utils/types";


const saveDataToDatabase = async (profile: Profile, posts: IGPost[]) => {
  await saveProfileToDatabase(profile);
  await savePostsToDatabase(posts);
};

const saveProfileToDatabase = async (profile: Profile) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { id: profile.id },
  });


  if (existingProfile) {
    const isSame =
      existingProfile.username === profile.username &&
      existingProfile.full_name === profile.full_name &&
      existingProfile.profile_pic_url === profile.profile_pic_url &&
      existingProfile.profile_pic_url_hd === profile.profile_pic_url_hd &&
      existingProfile.biography === profile.biography &&
      existingProfile.category_name === profile.category_name &&
      existingProfile.number_of_posts === profile.number_of_posts &&
      existingProfile.followers === profile.followers &&
      existingProfile.following === profile.following;

    if (isSame) {
      return; 
    }

    await prisma.profile.update({
      where: { 
        id: profile.id 
      },
      data: {
        username: profile.username,
        full_name: profile.full_name,
        profile_pic_url: profile.profile_pic_url,
        profile_pic_url_hd: profile.profile_pic_url_hd,
        biography: profile.biography,
        category_name: profile.category_name,
        number_of_posts: profile.number_of_posts,
        followers: profile.followers,
        following: profile.following,
      },
    });
    return; 
  }

  await prisma.profile.create({
    data: {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      profile_pic_url: profile.profile_pic_url,
      profile_pic_url_hd: profile.profile_pic_url_hd,
      biography: profile.biography,
      category_name: profile.category_name,
      number_of_posts: profile.number_of_posts,
      followers: profile.followers,
      following: profile.following,
    },
  });
  return; 
};

const savePostsToDatabase = async (posts: IGPost[]) => {
  const currentPosts = await prisma.post.findMany({});

  const newPostIds = posts.map(post => post.id);
  const currentPostIds = currentPosts.map(post => post.id);

  const idsToDelete = currentPostIds.filter(id => !newPostIds.includes(id));

  if (idsToDelete.length > 0) {
    await prisma.post.deleteMany({
      where: {
        id: { in: idsToDelete }
      }
    });
  }

  const postsToCreate = posts.filter(post => !currentPostIds.includes(post.id));
  const postsToUpdate = posts.filter(post => currentPostIds.includes(post.id));

  const createPromises = postsToCreate.map(post => {
    return prisma.post.create({
      data: {
        id: post.id,
        taken_at_timestamp: post.taken_at_timestamp,
        comment_count: post.comment_count,
        caption: post.caption,
        likes: post.likes,
        pictures: {
          create: post.pictures.map((picture, index) => ({
            id: picture.id,
            display_url: picture.display_url,
            order: index + 1,
          })),
        },
        videos: {
          create: post.videos.map((video, index) => ({
            id: video.id,
            display_url: video.display_url,
            video_url: video.video_url,
            order: index + 1,
          })),
        },
      },
    });
  });

  const updatePromises = postsToUpdate.map(post => {
    return prisma.post.update({
      where: { id: post.id },
      data: {
        comment_count: post.comment_count,
        caption: post.caption,
        likes: post.likes,
      }});
    });

  await Promise.all([...createPromises, ...updatePromises]);
  return; 
};




const getProfileData = async (): Promise<Profile | null> => {
  return await prisma.profile.findFirst({});
};

const getPostsData = async (): Promise<IGPost[]> => {
  return await prisma.post.findMany({
    include: {
      pictures: true,
      videos: true,
    },
    orderBy: {
      taken_at_timestamp: 'desc',
    },
  });
};

export default {
  saveDataToDatabase,
  getProfileData,
  getPostsData,
};