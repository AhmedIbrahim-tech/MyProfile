import Blog from '@/components/Blog/Blog';
// import ComingSoon from '@/pages/ComingSoon/ComingSoon';
import { sectionConfig } from '@/data/sectionConfig';
import '@/pages/BlogPage/BlogPage.css';

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

