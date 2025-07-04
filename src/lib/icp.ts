import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as team4_social_idl, canisterId as team4_social_id } from '../../src/declarations/team4_social';

const isLocal = import.meta.env.VITE_NETWORK === 'local';
const host = isLocal ? 'http://127.0.0.1:4943' : 'https://icp0.io';

const agent = new HttpAgent({ host });

if (isLocal) {
  // For local development, fetch root key for certificate validation
  agent.fetchRootKey();
}

export const team4Social = Actor.createActor(team4_social_idl, {
  agent,
  canisterId: team4_social_id,
}); 