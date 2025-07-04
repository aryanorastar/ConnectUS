import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostCard } from '@/components/PostCard';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewingFollowers, setViewingFollowers] = useState(false);
  const [viewingFollowing, setViewingFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        const user = await team4Social.getMyProfile();
        setProfile(user);
        const allPosts = await team4Social.getPosts();
        // Filter posts by current user principal
        const principal = user?.principal?.toText ? user.principal.toText() : user?.principal;
        const posts = allPosts.filter((post: any) => {
          const author = post.author?.toText ? post.author.toText() : post.author;
          return author === principal;
        }).map((post: any) => ({
          id: Number(post.id),
          author: principal,
          content: post.content,
          timestamp: Number(post.timestamp),
          likes: Number(post.likes),
          rewards: Number(post.rewards),
        })).reverse();
        setUserPosts(posts);
        // Fetch followers and following
        const followersList = await team4Social.getFollowers(user.principal);
        const followingList = await team4Social.getFollowing(user.principal);
        setFollowers(followersList);
        setFollowing(followingList);
        // Check if viewing own profile (for follow button logic)
        setIsFollowing(false); // For now, always false on own profile
      } catch (e) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchProfileAndPosts();
  }, []);

  const handleSaveProfile = async () => {
    setIsEditing(false);
    // Save profile changes to blockchain
    try {
      await team4Social.updateProfile(
        profile?.username || '',
        profile?.bio || '',
        profile?.location || '',
        profile?.website || ''
      );
      // Refresh profile data
      const user = await team4Social.getMyProfile();
      setProfile(user);
    } catch (e) {}
  };

  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      // Refresh posts
      const allPosts = await team4Social.getPosts();
      const principal = profile?.principal?.toText ? profile.principal.toText() : profile?.principal;
      const posts = allPosts.filter((post: any) => {
        const author = post.author?.toText ? post.author.toText() : post.author;
        return author === principal;
      }).map((post: any) => ({
        id: Number(post.id),
        author: principal,
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
      })).reverse();
      setUserPosts(posts);
    } catch (e) {}
  };

  const handleSendTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const principal = sendTo.trim();
      const amount = Number(sendAmount);
      if (!principal || isNaN(amount) || amount <= 0) {
        toast({ title: 'Invalid input', description: 'Enter a valid principal and amount.' });
        setSending(false);
        return;
      }
      const result = await team4Social.transferTokens(principal, amount);
      if (result) {
        toast({ title: 'Success', description: `Sent ${amount} T4T to ${principal}` });
        setSendTo('');
        setSendAmount('');
        // Refresh profile
        const user = await team4Social.getMyProfile();
        setProfile(user);
      } else {
        toast({ title: 'Failed', description: 'Transfer failed. Check your balance and try again.' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'An error occurred during transfer.' });
    }
    setSending(false);
  };

  const handleFollow = async () => {
    if (!profile?.principal) return;
    await team4Social.followUser(profile.principal);
    const followersList = await team4Social.getFollowers(profile.principal);
    setFollowers(followersList);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    if (!profile?.principal) return;
    await team4Social.unfollowUser(profile.principal);
    const followersList = await team4Social.getFollowers(profile.principal);
    setFollowers(followersList);
    setIsFollowing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Sidebar - Profile Info */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-none rounded-3xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <Avatar className="w-36 h-36 mx-auto border-4 border-indigo-400 shadow-lg">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-400 text-white text-5xl">
                      {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={profile?.username || ''}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        placeholder="Your name"
                        className="rounded-xl"
                      />
                      <Textarea
                        value={profile?.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Your bio"
                        className="min-h-[80px] rounded-xl"
                      />
                      <Input
                        value={profile?.location || ''}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="Location"
                        className="rounded-xl"
                      />
                      <Input
                        value={profile?.website || ''}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="Website"
                        className="rounded-xl"
                      />
                      <div className="flex gap-4 justify-center mt-2">
                        <Button onClick={handleSaveProfile} className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold rounded-xl px-6 py-2 shadow-md">Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl px-6 py-2">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-indigo-700">{profile?.username}</h2>
                      <p className="text-lg text-muted-foreground">{profile?.bio}</p>
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-sm text-muted-foreground">{profile?.location}</span>
                        <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-sm">{profile?.website}</a>
                      </div>
                      <Button onClick={() => setIsEditing(true)} className="mt-4 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold rounded-xl px-6 py-2 shadow-md">Edit Profile</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Followers/Following */}
            <Card className="bg-white/70 backdrop-blur-md shadow-lg border-none rounded-2xl">
              <CardContent className="py-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-indigo-700">Followers</h3>
                  <span className="font-semibold text-indigo-500">{followers.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {followers.map((f, i) => (
                    <Badge key={i} className="bg-indigo-100 text-indigo-700 rounded-xl px-3 py-1 text-sm">{f.toText ? f.toText().slice(0, 8) : String(f).slice(0, 8)}...</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 mb-2">
                  <h3 className="font-bold text-lg text-indigo-700">Following</h3>
                  <span className="font-semibold text-indigo-500">{following.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {following.map((f, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700 rounded-xl px-3 py-1 text-sm">{f.toText ? f.toText().slice(0, 8) : String(f).slice(0, 8)}...</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Token Transfer */}
            <Card className="bg-white/70 backdrop-blur-md shadow-lg border-none rounded-2xl">
              <CardContent className="py-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-4">Send T4T Tokens</h3>
                <form onSubmit={handleSendTokens} className="space-y-4">
                  <Input
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="Recipient Principal"
                    className="rounded-xl"
                  />
                  <Input
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="Amount"
                    type="number"
                    className="rounded-xl"
                  />
                  <Button type="submit" disabled={sending} className="w-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold rounded-xl px-6 py-2 shadow-md">
                    {sending ? 'Sending...' : 'Send Tokens'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          {/* Main Content - User Posts */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-none rounded-3xl">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-indigo-700">My Posts</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center bg-white/70 rounded-2xl shadow-lg border border-indigo-100">
                    <div className="mb-6">
                      <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-indigo-700 mb-2">No Posts Yet</h2>
                    <p className="text-lg text-muted-foreground mb-6">You haven't posted anything yet. Share your first post with the community!</p>
                    <div>
                      <span className="inline-block bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer" onClick={() => document.getElementById('post-form-input')?.focus()}>
                        Create Your First Post
                      </span>
                    </div>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div key={post.id} className="rounded-2xl bg-white/90 shadow-md p-6 mb-6 border border-indigo-100">
                      <PostCard post={post} onLike={handleLike} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;