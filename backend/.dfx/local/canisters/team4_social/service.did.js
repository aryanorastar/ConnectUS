export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'principal' : IDL.Principal,
    'username' : IDL.Text,
    'totalRewards' : IDL.Nat,
    'tokenBalance' : IDL.Nat,
    'postsCount' : IDL.Nat,
  });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Principal,
    'likes' : IDL.Nat,
    'timestamp' : IDL.Int,
    'rewards' : IDL.Nat,
  });
  const NFT = IDL.Record({
    'id': IDL.Nat,
    'owner': IDL.Principal,
    'metadata': IDL.Text,
    'timestamp': IDL.Int,
  });
  return IDL.Service({
    'createPost' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'getMyProfile' : IDL.Func([], [IDL.Opt(User)], []),
    'getPlatformStats' : IDL.Func(
        [],
        [IDL.Record({ 'totalUsers' : IDL.Nat, 'totalPosts' : IDL.Nat })],
        ['query'],
      ),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'likePost' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'transferTokens' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'mintNFT': IDL.Func([IDL.Text], [IDL.Nat], []),
    'getMyNFTs': IDL.Func([], [IDL.Vec(NFT)], []),
    'getNFTMetadata': IDL.Func([IDL.Nat], [IDL.Opt(NFT)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
