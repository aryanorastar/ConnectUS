import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment {
  'id' : bigint,
  'content' : string,
  'author' : Principal,
  'timestamp' : bigint,
  'postId' : bigint,
}
export interface NFT {
  'id' : bigint,
  'owner' : Principal,
  'metadata' : string,
  'timestamp' : bigint,
}
export interface Post {
  'id' : bigint,
  'content' : string,
  'author' : Principal,
  'mediaUrl' : string,
  'likes' : bigint,
  'timestamp' : bigint,
  'rewards' : bigint,
}
export interface User {
  'bio' : string,
  'principal' : Principal,
  'username' : string,
  'totalRewards' : bigint,
  'website' : string,
  'tokenBalance' : bigint,
  'location' : string,
  'postsCount' : bigint,
}
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string], bigint>,
  'createPost' : ActorMethod<[string, string], bigint>,
  'followUser' : ActorMethod<[Principal], boolean>,
  'getComments' : ActorMethod<[bigint], Array<Comment>>,
  'getFollowers' : ActorMethod<[Principal], Array<Principal>>,
  'getFollowing' : ActorMethod<[Principal], Array<Principal>>,
  'getLeaderboard' : ActorMethod<[bigint], Array<User>>,
  'getMyNFTs' : ActorMethod<[], Array<NFT>>,
  'getMyProfile' : ActorMethod<[], [] | [User]>,
  'getNFTMetadata' : ActorMethod<[bigint], [] | [NFT]>,
  'getPlatformStats' : ActorMethod<
    [],
    { 'totalUsers' : bigint, 'totalPosts' : bigint }
  >,
  'getPosts' : ActorMethod<[], Array<Post>>,
  'getTrendingHashtags' : ActorMethod<[bigint], Array<[string, bigint]>>,
  'getUserProfile' : ActorMethod<[Principal], [] | [User]>,
  'likePost' : ActorMethod<[bigint], boolean>,
  'mintNFT' : ActorMethod<[string], bigint>,
  'seedDemoData' : ActorMethod<[], boolean>,
  'transferTokens' : ActorMethod<[Principal, bigint], boolean>,
  'unfollowUser' : ActorMethod<[Principal], boolean>,
  'updateProfile' : ActorMethod<[string, string, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
