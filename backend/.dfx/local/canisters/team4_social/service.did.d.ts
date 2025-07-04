import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'content' : string,
  'author' : Principal,
  'likes' : bigint,
  'timestamp' : bigint,
  'rewards' : bigint,
}
export interface User {
  'principal' : Principal,
  'username' : string,
  'totalRewards' : bigint,
  'tokenBalance' : bigint,
  'postsCount' : bigint,
}
export interface _SERVICE {
  'createPost' : ActorMethod<[string], bigint>,
  'getMyProfile' : ActorMethod<[], [] | [User]>,
  'getPlatformStats' : ActorMethod<
    [],
    { 'totalUsers' : bigint, 'totalPosts' : bigint }
  >,
  'getPosts' : ActorMethod<[], Array<Post>>,
  'getUserProfile' : ActorMethod<[Principal], [] | [User]>,
  'likePost' : ActorMethod<[bigint], boolean>,
  'transferTokens' : ActorMethod<[Principal, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
