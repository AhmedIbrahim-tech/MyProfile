import Blog from '@/components/Blog';
// import ComingSoon from '@/pages/ComingSoon';
import { sectionConfig } from '@/data/sectionConfig';
import '@/assets/styles/pages/BlogPage.css';

const BlogPage = () => {
  if (!sectionConfig.blog) {
    return null;
  }

  return (
    <div className="blog-page">
      <Blog />
      {/* <ComingSoon /> */}
    </div>
  );
};

export default BlogPage;

