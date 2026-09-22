import { useParams } from 'react-router-dom';
import { ArticleReader } from '@/modules/blog';

const BlogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : undefined;

  return <ArticleReader postId={postId} />;
};

export default BlogDetailsPage;
