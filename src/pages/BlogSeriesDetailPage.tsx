import { BlogSeriesDetail } from '@/modules/blog';
import { sectionConfig } from '@/data/sectionConfig';

const BlogSeriesDetailPage = () => {
  if (!sectionConfig.blog) {
    return null;
  }

  return <BlogSeriesDetail />;
};

export default BlogSeriesDetailPage;
