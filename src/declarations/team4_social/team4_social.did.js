export const idlFactory = ({ IDL }) => {
  const Comment = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Principal,
    'timestamp' : IDL.Int,
    'postId' : IDL.Nat,
  });
  const User = IDL.Record({
    'bio' : IDL.Text,
    'principal' : IDL.Principal,
    'username' : IDL.Text,
    'totalRewards' : IDL.Nat,
    'website' : IDL.Text,
    'tokenBalance' : IDL.Nat,
    'location' : IDL.Text,
    'postsCount' : IDL.Nat,
  });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Principal,
    'mediaUrl' : IDL.Text,
    'likes' : IDL.Nat,
    'timestamp' : IDL.Int,
    'rewards' : IDL.Nat,
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Nat], []),
    'createPost' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'followUser' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'getComments' : IDL.Func([IDL.Nat], [IDL.Vec(Comment)], ['query']),
    'getFollowers' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getFollowing' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getLeaderboard' : IDL.Func([IDL.Nat], [IDL.Vec(User)], ['query']),
    'getMyProfile' : IDL.Func([], [IDL.Opt(User)], []),
    'getPlatformStats' : IDL.Func(
        [],
        [IDL.Record({ 'totalUsers' : IDL.Nat, 'totalPosts' : IDL.Nat })],
        ['query'],
      ),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'getTrendingHashtags' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'likePost' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'transferTokens' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'unfollowUser' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'updateProfile' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
