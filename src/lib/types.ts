export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio?: string
  isVerified?: boolean
}

export interface Post {
  id: string
  user: User
  imageUrl: string
  caption: string
  likes: number
  isLiked: boolean
  isBookmarked: boolean
  comments: Comment[]
  createdAt: string // relative time like "2h", "1d"
}

export interface Comment {
  id: string
  user: User
  text: string
  createdAt: string
}

export interface Story {
  id: string
  user: User
  isSeen: boolean
  isLive?: boolean
  isYourStory?: boolean
}

export interface Suggestion {
  id: string
  user: User
  reason: string // e.g. "Followed by john + 3 more"
}

export interface PostImage {
  id: number
  postId: number
  imageUrl: string
  position: number
  createdAt: string
}

export interface FeedPost {
  id: number
  userId: number
  imageUrl: string
  caption: string | null
  createdAt: string
  images: PostImage[]
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  likeCount: number
  commentCount: number
  likedByMe: boolean
  savedByMe: boolean
}

export interface PostDetail {
  id: number
  userId: number
  imageUrl: string
  caption: string | null
  createdAt: string
  images: PostImage[]
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  comments: {
    id: number
    postId: number
    userId: number
    content: string
    createdAt: string
    user: {
      id: number
      username: string
      displayName: string
      avatarUrl: string | null
    }
    likedByMe: boolean
  }[]
  likeCount: number
  likedByMe: boolean
  savedByMe: boolean
}

export interface PaginatedFeedResponse {
  posts: FeedPost[]
  nextCursor: number | null
}

export interface SuggestedUser {
  id: number
  username: string
  displayName: string
  avatarUrl: string | null
  mutualFollowersCount: number
}

export interface StorySegment {
  id: number
  storyId: number
  mediaUrl: string
  mediaType: "image" | "video"
  position: number
  createdAt: string
}

export interface StoryView {
  userId: number
  viewedAt: string
}

export interface FeedStory {
  id: number
  userId: number
  createdAt: string
  segments: StorySegment[]
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  views: StoryView[]
}

export interface UserProfile {
  id: number
  username: string
  displayName: string
  email: string
  avatarUrl: string | null
  bio: string | null
  isPrivate: boolean
  createdAt: string
  postsCount: number
  followersCount: number
  followingCount: number
  followStatus: "following" | "requested" | "none" | null
  isOwnProfile: boolean
}

export interface SearchUser {
  id: number
  username: string
  displayName: string
  email: string
  avatarUrl: string | null
  bio: string | null
  isPrivate: boolean
  createdAt: string
}

export interface RecentSearch {
  id: number
  userId: number
  searchedUserId: number
  createdAt: string
  searchedUser: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
}

export interface ApiNotification {
  id: number
  userId: number
  actorId: number
  type: "like" | "follow" | "follow_request" | "comment" | "mention"
  postId: number | null
  commentId: number | null
  read: boolean
  createdAt: string
  actor: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  post?: { id: number; imageUrl: string } | null
  comment?: { id: number; content: string } | null
}

export interface FollowRequest {
  requesterId: number
  targetId: number
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  requester: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
}

export interface PaginatedNotificationsResponse {
  notifications: ApiNotification[]
  nextCursor: number | null
}

export interface SavedPost {
  id: number
  userId: number
  imageUrl: string
  caption: string | null
  createdAt: string
  images?: PostImage[]
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
}
