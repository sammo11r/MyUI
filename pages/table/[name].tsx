import { useRouter } from 'next/router';

const Post = () => {
  const router = useRouter();
  const { name } = router.query;

  return <p>{name}</p>
}

export default Post;