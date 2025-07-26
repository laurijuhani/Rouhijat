const convertImagesToBase64 = async (imageUrls: string[], token: string): Promise<string[]> => {
  const promises = imageUrls.map(async (url) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.error(`Failed to fetch image from ${url}: ${response.statusText}`);
      return undefined;
    }

    const data = await response.blob();
    return await new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(undefined);
      reader.readAsDataURL(data);
    });
  });

  const base64Images = await Promise.all(promises);
  return base64Images.filter((img): img is string => !!img);
};


export const convertContentToBase64 = async (content: string, imageUrls: string[], token: string): Promise<string> => {
  const base64Images = await convertImagesToBase64(imageUrls, token);
  let updatedContent = content;

  imageUrls.forEach((url, index) => {
    const regex = new RegExp(`src=["']${url}["']`, 'g');
    updatedContent = updatedContent.replace(regex, `src="${base64Images[index]}"`);
  });
  
  return updatedContent;
}; 