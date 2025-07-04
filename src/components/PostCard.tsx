import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  rewards: number;
  onLike: (id: string) => void;
  onComment?: (id: number) => void;
  mediaUrl?: string;
}

export const PostCard = ({ id, author, content, timestamp, likes, rewards, onLike, onComment, mediaUrl }: PostCardProps) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    onLike(id);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 mb-2">
        <Avatar className="w-12 h-12 border-2 border-indigo-300 shadow">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-400 text-white text-xl">
            {author ? author[0]?.toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold text-indigo-700 text-lg">{author ? author.slice(0, 8) : 'Unknown'}...</div>
          <div className="text-xs text-muted-foreground">{new Date(Number(timestamp) / 1000000).toLocaleString()}</div>
        </div>
      </div>
      <div className="text-base text-foreground mb-2 whitespace-pre-line">{content}</div>
      {mediaUrl && (
        <div className="rounded-xl overflow-hidden mb-2">
          <img src={mediaUrl} alt="media" className="w-full object-cover max-h-72" />
        </div>
      )}
      <div className="flex items-center gap-4 mt-2">
        <button
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold transition-colors px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 shadow-sm"
          onClick={handleLike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.318 5.318a4.5 4.5 0 00-6.364 0c-1.878 1.878-1.878 4.922 0 6.8l5.657 5.657a.75.75 0 001.06 0l5.657-5.657c1.878-1.878 1.878-4.922 0-6.8a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes}
        </button>
        <span className="text-sm text-muted-foreground">{rewards} T4T</span>
        {onComment && (
          <button
            className="ml-auto text-indigo-500 hover:text-indigo-700 text-sm font-semibold px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            onClick={() => onComment(id)}
          >
            Comments
          </button>
        )}
      </div>
    </div>
  );
};