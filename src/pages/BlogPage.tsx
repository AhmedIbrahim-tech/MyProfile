import { BlogList } from '@/modules/blog';
import { sectionConfig } from '@/data/sectionConfig';
import '@/assets/styles/pages/BlogPage.css';

const BlogPage = () => {
  if (!sectionConfig.blog) {
    return null;
  }

  return (
    <div className="blog-page">
      <BlogList />
      {/* <ComingSoon /> */}
    </div>
  );
};

export default BlogPage;

