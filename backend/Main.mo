import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

actor Team4Social {
    type Post = {
        id: Nat;
        author: Principal;
        content: Text;
        mediaUrl: Text;
        timestamp: Int;
        likes: Nat;
        rewards: Nat;
    };

    type User = {
        principal: Principal;
        username: Text;
        tokenBalance: Nat;
        postsCount: Nat;
        totalRewards: Nat;
        bio: Text;
        location: Text;
        website: Text;
    };

    type Comment = {
        id: Nat;
        postId: Nat;
        author: Principal;
        content: Text;
        timestamp: Int;
    };

    // NFT type and storage
    type NFT = {
        id: Nat;
        owner: Principal;
        metadata: Text; // Could be a URL, JSON, or IPFS hash
        timestamp: Int;
    };

    private stable var nextPostId: Nat = 1;
    private var posts = HashMap.HashMap<Nat, Post>(10, Nat.equal, Hash.hash);
    private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private stable var nextCommentId: Nat = 1;
    private var comments = HashMap.HashMap<Nat, Comment>(10, Nat.equal, Hash.hash);
    private var followers = HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
    private var following = HashMap.HashMap<Principal, [Principal]>(10, Principal.equal, Principal.hash);
    private var hashtagCounts = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
    private stable var nextNFTId: Nat = 1;
    private var nfts = HashMap.HashMap<Nat, NFT>(10, Nat.equal, Hash.hash);

    // Helper: extract hashtags from text
    func extractHashtags(content: Text): [Text] {
        let words = Iter.toArray<Text>(Text.split(content, #char ' '));
        Array.filter<Text>(words, func(w) {
            let arr = Text.toArray(w);
            arr.size() > 1 and arr[0] == '#'
        })
    };

    // Create a new post
    public shared(msg) func createPost(content: Text, mediaUrl: Text): async Nat {
        let postId = nextPostId;
        nextPostId += 1;

        let post: Post = {
            id = postId;
            author = msg.caller;
            content = content;
            mediaUrl = mediaUrl;
            timestamp = Time.now();
            likes = 0;
            rewards = 0;
        };

        posts.put(postId, post);

        // Track hashtags
        let hashtags = extractHashtags(content);
        for (tag in hashtags.vals()) {
            let count = switch (hashtagCounts.get(tag)) { case (?c) c; case null 0 };
            hashtagCounts.put(tag, count + 1);
        };

        // Update user stats
        switch (users.get(msg.caller)) {
            case (?user) {
                let updatedUser = {
                    user with postsCount = user.postsCount + 1;
                };
                users.put(msg.caller, updatedUser);
            };
            case null {
                let newUser: User = {
                    principal = msg.caller;
                    username = Principal.toText(msg.caller);
                    tokenBalance = 100; // Starting balance
                    postsCount = 1;
                    totalRewards = 0;
                    bio = "";
                    location = "";
                    website = "";
                };
                users.put(msg.caller, newUser);
            };
        };

        postId
    };

    // Get all posts
    public query func getPosts(): async [Post] {
        Iter.toArray(posts.vals())
    };

    // Like a post
    public shared(msg) func likePost(postId: Nat): async Bool {
        switch (posts.get(postId)) {
            case (?post) {
                let updatedPost = {
                    post with likes = post.likes + 1;
                };
                posts.put(postId, updatedPost);
                
                // Reward post author with tokens
                switch (users.get(post.author)) {
                    case (?author) {
                        let rewardAmount = 1;
                        let updatedAuthor = {
                            author with 
                            tokenBalance = author.tokenBalance + rewardAmount;
                            totalRewards = author.totalRewards + rewardAmount;
                        };
                        users.put(post.author, updatedAuthor);
                    };
                    case null {};
                };
                true
            };
            case null { false };
        };
    };

    // Get user profile
    public query func getUserProfile(userPrincipal: Principal): async ?User {
        users.get(userPrincipal)
    };

    // Get current caller's profile
    public shared(msg) func getMyProfile(): async ?User {
        users.get(msg.caller)
    };

    // Transfer tokens between users
    public shared(msg) func transferTokens(to: Principal, amount: Nat): async Bool {
        switch (users.get(msg.caller)) {
            case (?sender) {
                if (sender.tokenBalance >= amount) {
                    let updatedSender = {
                        sender with tokenBalance = sender.tokenBalance - amount;
                    };
                    users.put(msg.caller, updatedSender);

                    switch (users.get(to)) {
                        case (?receiver) {
                            let updatedReceiver = {
                                receiver with tokenBalance = receiver.tokenBalance + amount;
                            };
                            users.put(to, updatedReceiver);
                        };
                        case null {
                            let newReceiver: User = {
                                principal = to;
                                username = Principal.toText(to);
                                tokenBalance = amount;
                                postsCount = 0;
                                totalRewards = 0;
                                bio = "";
                                location = "";
                                website = "";
                            };
                            users.put(to, newReceiver);
                        };
                    };
                    true
                } else {
                    false
                }
            };
            case null { false };
        };
    };

    // Get platform stats
    public query func getPlatformStats(): async {totalPosts: Nat; totalUsers: Nat} {
        {
            totalPosts = posts.size();
            totalUsers = users.size();
        }
    };

    // Update user profile
    public shared(msg) func updateProfile(username: Text, bio: Text, location: Text, website: Text): async Bool {
        switch (users.get(msg.caller)) {
            case (?user) {
                let updatedUser = {
                    user with
                    username = username;
                    bio = bio;
                    location = location;
                    website = website;
                };
                users.put(msg.caller, updatedUser);
                true
            };
            case null { false };
        }
    };

    // Get top N users by totalRewards
    public query func getLeaderboard(n: Nat): async [User] {
        let allUsers = Iter.toArray(users.vals());
        let sorted = Array.sort<User>(allUsers, func(a, b) {
            if (a.totalRewards < b.totalRewards) { #greater } // Descending
            else if (a.totalRewards > b.totalRewards) { #less }
            else { #equal }
        });
        if (n < sorted.size()) {
            Array.subArray(sorted, 0, n)
        } else {
            sorted
        }
    };

    // Add a comment to a post
    public shared(msg) func addComment(postId: Nat, content: Text): async Nat {
        let commentId = nextCommentId;
        nextCommentId += 1;
        let comment: Comment = {
            id = commentId;
            postId = postId;
            author = msg.caller;
            content = content;
            timestamp = Time.now();
        };
        comments.put(commentId, comment);
        commentId
    };

    // Get comments for a post
    public query func getComments(postId: Nat): async [Comment] {
        Iter.toArray(comments.vals())
            |> Array.filter<Comment>(_, func(c) { c.postId == postId })
    };

    // Follow a user
    public shared(msg) func followUser(target: Principal): async Bool {
        if (msg.caller == target) return false;
        let currFollowing = switch (following.get(msg.caller)) { case (?arr) arr; case null [] };
        if (Array.find<Principal>(currFollowing, func(p) { p == target }) != null) return false;
        following.put(msg.caller, Array.append<Principal>(currFollowing, [target]));
        let currFollowers = switch (followers.get(target)) { case (?arr) arr; case null [] };
        followers.put(target, Array.append<Principal>(currFollowers, [msg.caller]));
        true
    };

    // Unfollow a user
    public shared(msg) func unfollowUser(target: Principal): async Bool {
        let currFollowing = switch (following.get(msg.caller)) { case (?arr) arr; case null [] };
        following.put(msg.caller, Array.filter<Principal>(currFollowing, func(p) { p != target }));
        let currFollowers = switch (followers.get(target)) { case (?arr) arr; case null [] };
        followers.put(target, Array.filter<Principal>(currFollowers, func(p) { p != msg.caller }));
        true
    };

    // Get followers of a user
    public query func getFollowers(user: Principal): async [Principal] {
        switch (followers.get(user)) { case (?arr) arr; case null [] }
    };

    // Get following of a user
    public query func getFollowing(user: Principal): async [Principal] {
        switch (following.get(user)) { case (?arr) arr; case null [] }
    };

    // Get trending hashtags (top N)
    public query func getTrendingHashtags(n: Nat): async [(Text, Nat)] {
        let allTags = Iter.toArray(hashtagCounts.entries());
        let sorted = Array.sort<(Text, Nat)>(allTags, func(a, b) {
            if (a.1 < b.1) { #greater } else if (a.1 > b.1) { #less } else { #equal }
        });
        if (n < sorted.size()) {
            Array.subArray(sorted, 0, n)
        } else {
            sorted
        }
    };

    // Mint a new NFT
    public shared(msg) func mintNFT(metadata: Text): async Nat {
        let nftId = nextNFTId;
        nextNFTId += 1;
        let nft: NFT = {
            id = nftId;
            owner = msg.caller;
            metadata = metadata;
            timestamp = Time.now();
        };
        nfts.put(nftId, nft);
        nftId
    };

    // Get all NFTs owned by the caller
    public shared(msg) func getMyNFTs(): async [NFT] {
        Iter.toArray(nfts.vals())
            |> Array.filter<NFT>(_, func(n) { n.owner == msg.caller })
    };

    // Get NFT metadata by id
    public query func getNFTMetadata(nftId: Nat): async ?NFT {
        nfts.get(nftId);
    };

    // Seed demo data (for development/demo only)
    public func seedDemoData() : async Bool {
        if (posts.size() > 0) return false; // Only seed if empty
        let demoUsers = [
            ("alice", "Alice in Wonderland", "London", "https://alice.com", "Loving the blockchain!"),
            ("bob", "Bob the Builder", "New York", "https://bob.com", "Building decentralized apps."),
            ("carol", "Carol Coder", "Berlin", "https://carol.codes", "Code is poetry."),
        ];
        for ((username, display, location, website, bio) in demoUsers.vals()) {
            let principal = Principal.fromText("aaaaa-aa"); // Use anonymous for demo
            let newUser: User = {
                principal = principal;
                username = display;
                tokenBalance = 1000;
                postsCount = 0;
                totalRewards = 0;
                bio = bio;
                location = location;
                website = website;
            };
            users.put(principal, newUser);
        };
        let demoPosts = [
            ("alice", "Hello world! #welcome #blockchain", "", 0),
            ("bob", "Just deployed my first canister! #motoko #icp", "", 0),
            ("carol", "Check out my new dapp! #decentralized #web3", "", 0),
        ];
        for ((author, content, mediaUrl, likes) in demoPosts.vals()) {
            let postId = nextPostId;
            nextPostId += 1;
            let principal = Principal.fromText("aaaaa-aa");
            let post: Post = {
                id = postId;
                author = principal;
                content = content;
                mediaUrl = mediaUrl;
                timestamp = Time.now();
                likes = likes;
                rewards = 0;
            };
            posts.put(postId, post);
        };
        // Add some hashtags
        hashtagCounts.put("#welcome", 1);
        hashtagCounts.put("#blockchain", 1);
        hashtagCounts.put("#motoko", 1);
        hashtagCounts.put("#icp", 1);
        hashtagCounts.put("#decentralized", 1);
        hashtagCounts.put("#web3", 1);
        return true;
    }
}