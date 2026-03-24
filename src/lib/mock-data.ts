interface User {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  isVerified?: boolean
}

interface Comment {
  id: string
  user: User
  text: string
}

export interface MockPost {
  id: string
  user: User
  imageUrl: string
  caption: string
  likes: number
  isLiked: boolean
  isBookmarked: boolean
  comments: Comment[]
  createdAt: string
  location?: string
  hasStoryRing?: boolean
  imageCount?: number
}

export const mockPosts: MockPost[] = [
  {
    id: "1",
    user: {
      id: "2",
      username: "natgeo",
      displayName: "National Geographic",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
      isVerified: true,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=750&fit=crop",
    caption: "Explore the world's most breathtaking landscapes 🌍✨",
    likes: 125432,
    isLiked: false,
    isBookmarked: false,
    location: "Yosemite National Park",
    hasStoryRing: true,
    imageCount: 5,
    comments: [
      {
        id: "c1",
        user: {
          id: "5",
          username: "traveler_joe",
          displayName: "Joe",
          avatarUrl: "https://i.pravatar.cc/150?img=30",
        },
        text: "Absolutely stunning!",
      },
      {
        id: "c2",
        user: {
          id: "6",
          username: "photo_emma",
          displayName: "Emma",
          avatarUrl: "https://i.pravatar.cc/150?img=31",
        },
        text: "Where is this? 😍",
      },
    ],
    createdAt: "22h",
  },
  {
    id: "2",
    user: {
      id: "3",
      username: "foodnetwork",
      displayName: "Food Network",
      avatarUrl: "https://i.pravatar.cc/150?img=22",
      isVerified: true,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=750&fit=crop",
    caption: "Weekend brunch goals 🥞🍳 Who's hungry?",
    likes: 8534,
    isLiked: true,
    isBookmarked: true,
    location: "Brooklyn, New York",
    hasStoryRing: false,
    imageCount: 3,
    comments: [
      {
        id: "c3",
        user: {
          id: "7",
          username: "chef_mike",
          displayName: "Mike",
          avatarUrl: "https://i.pravatar.cc/150?img=32",
        },
        text: "Recipe please! 🙏",
      },
    ],
    createdAt: "5h",
  },
  {
    id: "3",
    user: {
      id: "4",
      username: "architecture_digest",
      displayName: "Arch Digest",
      avatarUrl: "https://i.pravatar.cc/150?img=24",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=750&fit=crop",
    caption:
      "Modern architecture at its finest. Clean lines, bold vision.",
    likes: 3421,
    isLiked: false,
    isBookmarked: false,
    location: "Tokyo, Japan",
    hasStoryRing: true,
    comments: [],
    createdAt: "1d",
  },
  {
    id: "4",
    user: {
      id: "8",
      username: "nasa",
      displayName: "NASA",
      avatarUrl: "https://i.pravatar.cc/150?img=26",
      isVerified: true,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=750&fit=crop",
    caption: "The cosmos never ceases to amaze us ✨🚀",
    likes: 542891,
    isLiked: true,
    isBookmarked: false,
    location: "Kennedy Space Center, FL",
    hasStoryRing: true,
    imageCount: 4,
    comments: [
      {
        id: "c4",
        user: {
          id: "9",
          username: "space_fan",
          displayName: "Space Fan",
          avatarUrl: "https://i.pravatar.cc/150?img=33",
        },
        text: "Mind-blowing!",
      },
      {
        id: "c5",
        user: {
          id: "10",
          username: "astro_nerd",
          displayName: "Astro",
          avatarUrl: "https://i.pravatar.cc/150?img=34",
        },
        text: "Is this from Webb telescope?",
      },
    ],
    createdAt: "2d",
  },
  {
    id: "5",
    user: {
      id: "11",
      username: "streetstyle",
      displayName: "Street Style",
      avatarUrl: "https://i.pravatar.cc/150?img=28",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    caption: "Less is more. Minimalist vibes only. ✌️",
    likes: 1876,
    isLiked: false,
    isBookmarked: true,
    location: "Copenhagen, Denmark",
    hasStoryRing: false,
    comments: [
      {
        id: "c6",
        user: {
          id: "12",
          username: "minimal_life",
          displayName: "Minimal",
          avatarUrl: "https://i.pravatar.cc/150?img=35",
        },
        text: "Love the aesthetic ✨",
      },
    ],
    createdAt: "3d",
  },
]

// Explore posts — minimal shape for the post detail modal
const exploreMockPosts: MockPost[] = [
  { id: "e1", user: { id: "2", username: "natgeo", displayName: "National Geographic", avatarUrl: "https://i.pravatar.cc/150?img=20", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=750&fit=crop", caption: "Explore the world's most breathtaking landscapes", likes: 10732, isLiked: false, isBookmarked: false, comments: [], createdAt: "4h" },
  { id: "e2", user: { id: "7", username: "urban_alex", displayName: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?img=15" }, imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=750&fit=crop", caption: "Stars above the mountains", likes: 45200, isLiked: false, isBookmarked: false, comments: [], createdAt: "6h" },
  { id: "e3", user: { id: "5", username: "foodie_marco", displayName: "Marco Rossi", avatarUrl: "https://i.pravatar.cc/150?img=33" }, imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=750&fit=crop", caption: "Misty morning in the valley", likes: 8340, isLiked: false, isBookmarked: false, imageCount: 3, comments: [], createdAt: "8h" },
  { id: "e4", user: { id: "11", username: "fitlife_anna", displayName: "Anna Schmidt", avatarUrl: "https://i.pravatar.cc/150?img=47", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=750&fit=crop", caption: "Forest therapy", likes: 3210, isLiked: false, isBookmarked: false, comments: [], createdAt: "10h" },
  { id: "e5", user: { id: "2", username: "natgeo", displayName: "National Geographic", avatarUrl: "https://i.pravatar.cc/150?img=20", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600&h=750&fit=crop", caption: "Wildlife in its purest form", likes: 28900, isLiked: false, isBookmarked: false, comments: [], createdAt: "12h" },
  { id: "e6", user: { id: "7", username: "urban_alex", displayName: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?img=15" }, imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=750&fit=crop", caption: "Ocean blues", likes: 15600, isLiked: false, isBookmarked: false, comments: [], createdAt: "1d" },
  { id: "e7", user: { id: "3", username: "foodnetwork", displayName: "Food Network", avatarUrl: "https://i.pravatar.cc/150?img=22", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=750&fit=crop", caption: "To the moon and back", likes: 92100, isLiked: false, isBookmarked: false, imageCount: 4, comments: [], createdAt: "1d" },
  { id: "e8", user: { id: "5", username: "foodie_marco", displayName: "Marco Rossi", avatarUrl: "https://i.pravatar.cc/150?img=33" }, imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=750&fit=crop", caption: "Travel far, travel wide", likes: 6780, isLiked: false, isBookmarked: false, comments: [], createdAt: "2d" },
  { id: "e9", user: { id: "11", username: "fitlife_anna", displayName: "Anna Schmidt", avatarUrl: "https://i.pravatar.cc/150?img=47", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=750&fit=crop", caption: "Adventure awaits", likes: 41300, isLiked: false, isBookmarked: false, comments: [], createdAt: "2d" },
  { id: "e10", user: { id: "7", username: "urban_alex", displayName: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?img=15" }, imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=750&fit=crop", caption: "Road trip vibes", likes: 5430, isLiked: false, isBookmarked: false, comments: [], createdAt: "3d" },
  { id: "e11", user: { id: "2", username: "natgeo", displayName: "National Geographic", avatarUrl: "https://i.pravatar.cc/150?img=20", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=750&fit=crop", caption: "Through the lens", likes: 12400, isLiked: false, isBookmarked: false, comments: [], createdAt: "3d" },
  { id: "e12", user: { id: "11", username: "fitlife_anna", displayName: "Anna Schmidt", avatarUrl: "https://i.pravatar.cc/150?img=47", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop", caption: "Gym session complete", likes: 7890, isLiked: false, isBookmarked: false, comments: [], createdAt: "4d" },
  { id: "e13", user: { id: "7", username: "urban_alex", displayName: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?img=15" }, imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=750&fit=crop", caption: "Street art speaks", likes: 23100, isLiked: false, isBookmarked: false, comments: [], createdAt: "4d" },
  { id: "e14", user: { id: "5", username: "foodie_marco", displayName: "Marco Rossi", avatarUrl: "https://i.pravatar.cc/150?img=33" }, imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=750&fit=crop", caption: "City never sleeps", likes: 18700, isLiked: false, isBookmarked: false, imageCount: 5, comments: [], createdAt: "5d" },
  { id: "e15", user: { id: "3", username: "foodnetwork", displayName: "Food Network", avatarUrl: "https://i.pravatar.cc/150?img=22", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=750&fit=crop", caption: "Pizza perfection", likes: 9340, isLiked: false, isBookmarked: false, comments: [], createdAt: "5d" },
  { id: "e16", user: { id: "2", username: "natgeo", displayName: "National Geographic", avatarUrl: "https://i.pravatar.cc/150?img=20", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=750&fit=crop", caption: "Earth from above", likes: 67500, isLiked: false, isBookmarked: false, comments: [], createdAt: "6d" },
  { id: "e17", user: { id: "7", username: "urban_alex", displayName: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?img=15" }, imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&h=750&fit=crop", caption: "Red planet dreams", likes: 4560, isLiked: false, isBookmarked: false, comments: [], createdAt: "1w" },
  { id: "e18", user: { id: "11", username: "fitlife_anna", displayName: "Anna Schmidt", avatarUrl: "https://i.pravatar.cc/150?img=47", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&h=750&fit=crop", caption: "Launch day", likes: 31200, isLiked: false, isBookmarked: false, comments: [], createdAt: "1w" },
  { id: "e19", user: { id: "5", username: "foodie_marco", displayName: "Marco Rossi", avatarUrl: "https://i.pravatar.cc/150?img=33" }, imageUrl: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&h=750&fit=crop", caption: "Nebula nights", likes: 14300, isLiked: false, isBookmarked: false, imageCount: 2, comments: [], createdAt: "1w" },
  { id: "e20", user: { id: "3", username: "foodnetwork", displayName: "Food Network", avatarUrl: "https://i.pravatar.cc/150?img=22", isVerified: true }, imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=750&fit=crop", caption: "Cosmic wonders", likes: 52400, isLiked: false, isBookmarked: false, comments: [], createdAt: "2w" },
]

const allPosts = [...mockPosts, ...exploreMockPosts]

export function getPostById(id: string): MockPost | undefined {
  return allPosts.find((p) => p.id === id)
}

// --- Profiles ---

export interface MockHighlight {
  id: string
  label: string
  imageUrl: string
}

export interface MockProfile {
  username: string
  displayName: string
  avatarUrl: string
  isVerified: boolean
  isPrivate?: boolean
  category?: string
  bio: string[]
  postsCount: number
  followersCount: string
  followingCount: number
  isFollowing: boolean
  mutualFollowers: { username: string; avatarUrl: string }[]
  mutualCount: number
  highlights: MockHighlight[]
  gridPosts: { id: string; imageUrl: string; isCarousel?: boolean; isVideo?: boolean }[]
}

export const mockProfiles: Record<string, MockProfile> = {
  natgeo: {
    username: "natgeo",
    displayName: "National Geographic",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    isVerified: true,
    category: "Media/News Company",
    bio: [
      "📸 Experience the world through the eyes of National Geographic photographers.",
      "🌍 Tag #natgeo for a chance to be featured.",
    ],
    postsCount: 28742,
    followersCount: "283M",
    followingCount: 156,
    isFollowing: true,
    mutualFollowers: [
      { username: "sarah_j", avatarUrl: "https://i.pravatar.cc/150?img=1" },
      { username: "mike.travel", avatarUrl: "https://i.pravatar.cc/150?img=3" },
      { username: "emma.photos", avatarUrl: "https://i.pravatar.cc/150?img=5" },
    ],
    mutualCount: 24,
    highlights: [
      { id: "h1", label: "Wildlife", imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=150&h=150&fit=crop" },
      { id: "h2", label: "Ocean", imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop" },
      { id: "h3", label: "Space", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150&h=150&fit=crop" },
      { id: "h4", label: "Travel", imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop" },
      { id: "h5", label: "Photo Tips", imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&h=150&fit=crop" },
      { id: "h6", label: "Climate", imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&h=150&fit=crop" },
    ],
    gridPosts: [
      { id: "g1", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop" },
      { id: "g2", imageUrl: "https://images.unsplash.com/photo-1518173946687-a3e73f0e0d9f?w=400&h=400&fit=crop", isCarousel: true },
      { id: "g3", imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop" },
      { id: "g4", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop", isVideo: true },
      { id: "g5", imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop", isCarousel: true },
      { id: "g6", imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop" },
      { id: "g7", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop" },
      { id: "g8", imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop", isCarousel: true },
      { id: "g9", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop" },
      { id: "g10", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
      { id: "g11", imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop", isVideo: true },
      { id: "g12", imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop" },
    ],
  },
  nasa: {
    username: "nasa",
    displayName: "NASA",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    isVerified: true,
    isPrivate: true,
    category: "Government organization",
    bio: [
      "🚀 Explore the universe and discover our home planet.",
      "🌌 Hubble • Webb • Mars • Moon to Mars",
      "🔗 go.nasa.gov/links",
    ],
    postsCount: 4218,
    followersCount: "97.5M",
    followingCount: 82,
    isFollowing: false,
    mutualFollowers: [
      { username: "tech_sam", avatarUrl: "https://i.pravatar.cc/150?img=12" },
    ],
    mutualCount: 8,
    highlights: [
      { id: "h1", label: "Webb", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop" },
      { id: "h2", label: "Mars", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=150&h=150&fit=crop" },
      { id: "h3", label: "ISS", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150&h=150&fit=crop" },
      { id: "h4", label: "Artemis", imageUrl: "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=150&h=150&fit=crop" },
    ],
    gridPosts: [
      { id: "g1", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop" },
      { id: "g2", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop", isCarousel: true },
      { id: "g3", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop" },
      { id: "g4", imageUrl: "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=400&h=400&fit=crop", isVideo: true },
      { id: "g5", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop" },
      { id: "g6", imageUrl: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400&h=400&fit=crop", isCarousel: true },
      { id: "g7", imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=400&fit=crop" },
      { id: "g8", imageUrl: "https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=400&h=400&fit=crop" },
      { id: "g9", imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop", isVideo: true },
    ],
  },
}

export function getProfile(username: string): MockProfile | undefined {
  return mockProfiles[username]
}

// --- Reels ---

export interface MockReel {
  id: string
  user: {
    username: string
    avatarUrl: string
    isVerified?: boolean
  }
  imageUrl: string
  caption: string
  audioName: string
  likes: number
  comments: number
  isLiked: boolean
  isFollowing: boolean
}

export const mockReels: MockReel[] = [
  {
    id: "r1",
    user: { username: "natgeo", avatarUrl: "https://i.pravatar.cc/150?img=20", isVerified: true },
    imageUrl: "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=450&h=800&fit=crop",
    caption: "The northern lights dancing over Iceland 🇮🇸✨ #aurora #nature",
    audioName: "Original audio",
    likes: 284320,
    comments: 3421,
    isLiked: false,
    isFollowing: true,
  },
  {
    id: "r2",
    user: { username: "streetstyle", avatarUrl: "https://i.pravatar.cc/150?img=28" },
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=450&h=800&fit=crop",
    caption: "Street fashion that speaks volumes 🔥 #fashion #ootd",
    audioName: "Trending beat · 42K reels",
    likes: 15230,
    comments: 287,
    isLiked: true,
    isFollowing: false,
  },
  {
    id: "r3",
    user: { username: "nasa", avatarUrl: "https://i.pravatar.cc/150?img=26", isVerified: true },
    imageUrl: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=450&h=800&fit=crop",
    caption: "A supernova remnant captured by Webb telescope 🔭🌌 #space",
    audioName: "Interstellar Theme · Hans Zimmer",
    likes: 892100,
    comments: 12450,
    isLiked: false,
    isFollowing: true,
  },
  {
    id: "r4",
    user: { username: "foodie_dan", avatarUrl: "https://i.pravatar.cc/150?img=7" },
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&h=800&fit=crop",
    caption: "Making the perfect homemade pizza 🍕 Recipe in bio!",
    audioName: "Original audio",
    likes: 43200,
    comments: 892,
    isLiked: false,
    isFollowing: false,
  },
  {
    id: "r5",
    user: { username: "mike.travel", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=450&h=800&fit=crop",
    caption: "Lost in the Swiss Alps 🏔️ This view was worth the 6-hour hike",
    audioName: "Aesthetic vibes · 128K reels",
    likes: 67800,
    comments: 1240,
    isLiked: true,
    isFollowing: true,
  },
  {
    id: "r6",
    user: { username: "yoga_lisa", avatarUrl: "https://i.pravatar.cc/150?img=9" },
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=450&h=800&fit=crop",
    caption: "Morning flow 🧘‍♀️ Start your day with intention",
    audioName: "Calm meditation · 56K reels",
    likes: 21500,
    comments: 345,
    isLiked: false,
    isFollowing: false,
  },
]
