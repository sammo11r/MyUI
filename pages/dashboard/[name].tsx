import { useRouter } from "next/router";

/**
 * @return {*}
 */
const Post = (): any => {
  const router = useRouter();
  const { name } = router.query;

  return <p>{name}</p>;
};

export default Post;
