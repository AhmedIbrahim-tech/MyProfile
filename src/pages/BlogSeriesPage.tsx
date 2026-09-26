import { BlogSeriesList } from '@/modules/blog';
import { sectionConfig } from '@/data/sectionConfig';

const BlogSeriesPage = () => {
  if (!sectionConfig.blog) {
    return null;
  }

  return <BlogSeriesList />;
};

export default BlogSeriesPage;
