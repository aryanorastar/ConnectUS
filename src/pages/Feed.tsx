import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
import { PostCard } from '@/components/PostCard';
import { TokenRewards } from '@/components/TokenRewards';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  rewards: number;
  mediaUrl: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch posts from the canister
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const canisterPosts = await team4Social.getPosts();
      // Map backend posts to frontend format
      const mapped = canisterPosts.map((post: any) => ({
        id: Number(post.id),
        author: post.author.toText ? post.author.toText() : String(post.author),
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
        mediaUrl: post.mediaUrl,
      }));
      setPosts(mapped.reverse());
    } catch (e) {
      // Optionally handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post on-chain
  const handleNewPost = async (content: string, mediaUrl: string) => {
    try {
      await team4Social.createPost(content, mediaUrl);
      fetchPosts();
    } catch (e) {
      // Optionally handle error
    }
  };

  // Like a post on-chain
  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      fetchPosts();
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleOpenComments = async (postId: number) => {
    setOpenComments(openComments === postId ? null : postId);
    if (openComments !== postId) {
      setCommentLoading(true);
      try {
        const postComments = await team4Social.getComments(postId);
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      } catch (e) {}
      setCommentLoading(false);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await team4Social.addComment(postId, commentInput);
      const postComments = await team4Social.getComments(postId);
      setComments((prev) => ({ ...prev, [postId]: postComments }));
      setCommentInput('');
      toast({ title: 'Comment added!', description: 'Your comment is now on-chain.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to add comment.' });
    }
    setCommentLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <PostForm onPost={handleNewPost} />
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/70 rounded-2xl shadow-lg border border-indigo-100">
              <div className="mb-6">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9zm0-4.5v-6m0 0V7.5m0 2.25h2.25m-2.25 0H9.75" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-indigo-700 mb-2">Welcome to ConnectUS!</h2>
              <p className="text-lg text-muted-foreground mb-6">Your feed is empty. Be the first to create a post and start the conversation.</p>
              <div>
                <span className="inline-block bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer" onClick={() => document.getElementById('post-form-input')?.focus()}>
                  Create Your First Post
                </span>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-2xl bg-white/80 shadow-lg p-6 hover:shadow-2xl transition-all border border-indigo-100">
                <PostCard post={post} onLike={handleLike} onOpenComments={handleOpenComments} openComments={openComments} comments={comments[post.id] || []} onAddComment={handleAddComment} commentInput={commentInput} setCommentInput={setCommentInput} commentLoading={commentLoading} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;