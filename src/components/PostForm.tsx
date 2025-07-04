import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PostFormProps {
  onPost: (content: string, mediaUrl: string) => void;
}

export const PostForm = ({ onPost }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMediaPreview(ev.target?.result as string);
      setMediaUrl(ev.target?.result as string); // For demo, use base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPosting(true);
    
    // Simulate posting delay
    setTimeout(() => {
      onPost(content, mediaUrl);
      setContent('');
      setMediaUrl('');
      setMediaPreview('');
      setIsPosting(false);
      toast({
        title: "Post published!",
        description: "Your post has been added to the blockchain.",
      });
    }, 1500);
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;

  return (
    <Card className="w-full shadow-card hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">ME</AvatarFallback>
          </Avatar>
          <span className="text-lg">Share your thoughts on-chain</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's happening in the decentralized world?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-border focus:border-primary transition-colors"
            maxLength={characterLimit}
          />
          {/* Media upload */}
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" onChange={handleMediaChange} disabled={isPosting} />
            {mediaPreview && (
              <img src={mediaPreview} alt="preview" className="h-16 rounded border" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Permanent • Immutable
              </Badge>
              <span className={`text-xs ${remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} characters left
              </span>
            </div>
            
            <Button 
              type="submit" 
              disabled={!content.trim() || isPosting}
              className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 min-w-[100px]"
            >
              {isPosting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </div>
              ) : (
                'Post to Chain'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};