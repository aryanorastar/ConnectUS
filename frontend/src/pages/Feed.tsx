import { useState } from 'react';
import { PostForm } from '@/components/PostForm';
import { PostCard } from '@/components/PostCard';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  rewards: number;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'CryptoEnthusiast',
      content: 'Just deployed my first smart contract on ICP! The future of web3 is here. 🚀',
      timestamp: '2 hours ago',
      likes: 24,
      rewards: 5
    },
    {
      id: '2', 
      author: 'BlockchainDev',
      content: 'Team4 Social is revolutionizing how we interact online. True ownership of our data! #Web3 #ICP',
      timestamp: '4 hours ago',
      likes: 18,
      rewards: 3
    },
    {
      id: '3',
      author: 'DeFiExplorer',
      content: 'The decentralized social media experience is incredible. No censorship, true freedom!',
      timestamp: '6 hours ago',
      likes: 31,
      rewards: 7
    }
  ]);

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'You',
      content,
      timestamp: 'Just now',
      likes: 0,
      rewards: 0
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, rewards: post.rewards + 1 }
        : post
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Feed</h1>
        
        <PostForm onPost={handleNewPost} />
        
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onLike={handleLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;