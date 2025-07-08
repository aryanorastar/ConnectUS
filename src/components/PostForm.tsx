import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Hash, Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, X } from 'lucide-react';

interface PostFormProps {
  onPost: (content: string, mediaUrl: string) => void;
}

const HASHTAG_SUGGESTIONS = [
  '#ICP', '#Web3', '#crypto', '#blockchain', '#DeFi', '#NFTs', '#Motoko', '#React', '#TypeScript', '#AI', '#OpenSource', '#Innovation', '#Startup', '#Tech', '#Art', '#Gaming', '#Music', '#Education', '#Food', '#Travel', '#Photography', '#Design', '#UX', '#UI', '#Community'
];

export const PostForm = ({ onPost }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState('');

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
    setTimeout(() => {
      onPost(content, mediaUrl);
      setContent('');
      setMediaUrl('');
      setMediaPreview('');
      setIsPosting(false);
      setShowPreview(false);
      toast({
        title: "Post published!",
        description: "Your post has been added to the blockchain.",
      });
    }, 1500);
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;

  // Rich text formatting handlers
  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = document.querySelector('[data-post-form-input]') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = content.slice(0, start) + before + content.slice(start, end) + after + content.slice(end);
    setContent(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + before.length + (end - start) + after.length;
    }, 0);
  };

  const handleFormat = (type: 'bold' | 'italic' | 'list' | 'link') => {
    switch (type) {
      case 'bold':
        insertAtCursor('**', '**');
        break;
      case 'italic':
        insertAtCursor('*', '*');
        break;
      case 'list':
        insertAtCursor('\n- ');
        break;
      case 'link':
        insertAtCursor('[text](url)');
        break;
    }
  };

  // Hashtag suggestion logic
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    const match = value.match(/#(\w*)$/);
    if (match) {
      setShowHashtagSuggestions(true);
      setHashtagQuery(match[1]);
    } else {
      setShowHashtagSuggestions(false);
      setHashtagQuery('');
    }
  };

  const filteredHashtags = HASHTAG_SUGGESTIONS.filter(tag => tag.toLowerCase().includes(hashtagQuery.toLowerCase()) && tag !== `#${hashtagQuery}`);

  const handleHashtagClick = (tag: string) => {
    setContent(prev => prev.replace(/#(\w*)$/, tag + ' '));
    setShowHashtagSuggestions(false);
    setHashtagQuery('');
  };

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
          {/* Rich text formatting toolbar */}
          <div className="flex items-center gap-4 mb-1">
            <Button type="button" size="icon" variant="ghost" onClick={() => handleFormat('bold')} title="Bold"><Bold className="w-4 h-4" /></Button>
            <Button type="button" size="icon" variant="ghost" onClick={() => handleFormat('italic')} title="Italic"><Italic className="w-4 h-4" /></Button>
            <Button type="button" size="icon" variant="ghost" onClick={() => handleFormat('list')} title="List"><List className="w-4 h-4" /></Button>
            <Button type="button" size="icon" variant="ghost" onClick={() => handleFormat('link')} title="Link"><LinkIcon className="w-4 h-4" /></Button>
            <Button type="button" size="icon" variant="ghost" title="Add Image" asChild>
              <label>
                <ImageIcon className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleMediaChange} disabled={isPosting} className="hidden" />
              </label>
            </Button>
            <Button type="button" size="icon" variant="ghost" onClick={() => setShowPreview(p => !p)} title={showPreview ? 'Hide Preview' : 'Show Preview'}>
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {/* Textarea with hashtag suggestions */}
          {!showPreview ? (
            <div className="relative">
              <textarea
                placeholder="What's happening in the decentralized world?"
                value={content}
                onChange={handleContentChange}
                className="min-h-[120px] resize-none border-border focus:border-primary transition-colors w-full rounded-md p-3 text-base"
                maxLength={characterLimit}
                data-post-form-input
              />
              {/* Hashtag suggestions dropdown */}
              {showHashtagSuggestions && filteredHashtags.length > 0 && (
                <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded shadow-lg z-10 w-64 max-h-40 overflow-y-auto">
                  {filteredHashtags.map(tag => (
                    <div
                      key={tag}
                      className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                      onClick={() => handleHashtagClick(tag)}
                    >
                      <Hash className="w-4 h-4 text-primary" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/40 rounded p-4 border border-border">
              <div className="mb-2 text-muted-foreground text-xs">Preview</div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>') }} />
              {mediaPreview && (
                <div className="mt-3 relative inline-block">
                  <img src={mediaPreview} alt="preview" className="h-32 rounded border" />
                  <Button type="button" size="icon" variant="ghost" className="absolute top-1 right-1 bg-white/80" onClick={() => { setMediaPreview(''); setMediaUrl(''); }}><X className="w-4 h-4" /></Button>
                </div>
              )}
            </div>
          )}
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
              className="bg-[#6C47FF] text-white font-bold transition-all duration-300 min-w-[120px] rounded-lg shadow hover:bg-[#5a38d6]"
            >
              {isPosting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </div>
              ) : (
                'Post On-chain'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};