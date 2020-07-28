export default function sanitize(item) {
  return {
    text: item.edge_media_to_caption.edges[0].node.text,
    link: `https://www.instagram.com/p/${item.shortcode}`,
    image: {
      url: item.display_url,
      height: item.dimensions.height,
      width: item.dimensions.width,
    },
    comments: item.edge_media_to_comment.count,
    likes: item.edge_liked_by.count,
    created: new Date(item.taken_at_timestamp * 1000),
  };
}
