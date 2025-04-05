
export const isValidYouTubeEmbedUrl = (url: string) => {
    const embedRegex =
      /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/;
    return embedRegex.test(url);
  };