import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Clock, 
  Award, 
  User, 
  ThumbsUp,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  FileText,
  Smile,
  Hash
} from 'lucide-react';

interface PostCardProps {
  id: number;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  rewards: number;
  mediaUrl?: string;
  onLike?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onOpenComments?: (postId: number) => void;
  openComments?: number | null;
  comments?: any[];
  commentInput?: string;
  setCommentInput?: (input: string) => void;
  handleAddComment?: (postId: number) => void;
  commentLoading?: boolean;
}

const PostCard = ({
  id,
  author,
  content,
  timestamp,
  likes,
  rewards,
  mediaUrl,
  onLike,
  onShare,
  onOpenComments,
  openComments,
  comments = [],
  commentInput = '',
  setCommentInput,
  handleAddComment,
  commentLoading = false
}: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const { toast } = useToast();

  const formatTimestamp = (timestamp: number) => {
    try {
      // Ensure timestamp is a valid number
      if (!timestamp || isNaN(timestamp)) {
        return 'Just now';
      }

      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }

      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Just now';
    }
  };

  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  };

  const extractMentions = (content: string) => {
    const mentionRegex = /@[\w]+/g;
    return content.match(mentionRegex) || [];
  };

  const extractLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.match(urlRegex) || [];
  };

  const renderRichContent = (text: string) => {
    const hashtags = extractHashtags(text);
    const mentions = extractMentions(text);
    const links = extractLinks(text);
    
    let processedText = text;
    
    // Replace hashtags with styled spans
    hashtags.forEach(tag => {
      processedText = processedText.replace(tag, `<span class="text-blue-500 font-medium cursor-pointer hover:underline">${tag}</span>`);
    });
    
    // Replace mentions with styled spans
    mentions.forEach(mention => {
      processedText = processedText.replace(mention, `<span class="text-purple-500 font-medium cursor-pointer hover:underline">${mention}</span>`);
    });
    
    // Replace links with styled spans
    links.forEach(link => {
      processedText = processedText.replace(link, `<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-green-500 underline hover:text-green-600">${link}</a>`);
    });
    
    return processedText;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(id);
    }
  };

  const handleOpenComments = () => {
    if (onOpenComments) {
      onOpenComments(id);
    }
  };

  const handleAddCommentLocal = () => {
    if (handleAddComment && commentInput.trim()) {
      handleAddComment(id);
    }
  };

  const getMediaType = (url: string) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return 'video';
    return 'unknown';
  };

  const shouldTruncate = content.length > 280;
  const displayContent = showFullContent ? content : content.slice(0, 280);
  const hashtags = extractHashtags(content);
  const mentions = extractMentions(content);
  const links = extractLinks(content);

  // Simple author display - just use the author string as provided
  const displayName = author;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50">
      <CardContent className="p-6">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-400 text-white font-semibold">
                {displayName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{displayName}</span>
                <Badge variant="outline" size="sm" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  User
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimestamp(timestamp)}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderRichContent(displayContent) }}
            />
            
            {shouldTruncate && !showFullContent && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullContent(true)}
                className="text-primary hover:text-primary/80"
              >
                Show more
              </Button>
            )}
            
            {shouldTruncate && showFullContent && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullContent(false)}
                className="text-primary hover:text-primary/80"
              >
                Show less
              </Button>
            )}
          </div>

          {/* Media Content */}
          {mediaUrl && (
            <div className="rounded-lg overflow-hidden">
              {getMediaType(mediaUrl) === 'image' ? (
                <img 
                  src={mediaUrl} 
                  alt="Post media" 
                  className="w-full max-h-96 object-cover"
                />
              ) : getMediaType(mediaUrl) === 'video' ? (
                <video 
                  src={mediaUrl} 
                  controls 
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <div className="p-4 bg-muted rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Media attachment</span>
                </div>
              )}
            </div>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likes}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleOpenComments}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments.length}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {rewards} CU
              </Badge>
            </div>
          </div>

          {/* Comments Section */}
          {openComments === id && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h4 className="font-semibold text-sm">Comments</h4>
              
              {commentLoading ? (
                <div className="text-center py-4">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">
                          {comment.author?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.timestamp || Date.now())}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
              
              {/* Add Comment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput?.(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddCommentLocal}
                  disabled={!commentInput.trim() || commentLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;