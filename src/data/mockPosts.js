// Mock data for posts
export const MOCK_POSTS = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    text: 'Just hit my 30-day streak! Up 0.5 inches this month! The hanging exercises and sleep routine have been game changers. Anyone else seeing results from the hanging routine?',
    heightTag: '178 cm',
    likeCount: 24,
    commentCount: 5,
    liked: false,
    saved: false,
    images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'],
    comments: [
      {
        id: '201',
        user: {
          id: '102',
          name: 'Sarah Williams',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        text: 'Amazing progress! What time do you do your hanging exercises?',
        createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      },
      {
        id: '202',
        user: {
          id: '103',
          name: 'David Chen',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
        },
        text: 'I\'ve been doing the same routine! Seeing about 0.3" per month.',
        createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      }
    ]
  },
  {
    id: '2',
    user: {
      id: '104',
      name: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    text: 'Question for the tribe: has anyone found a good way to maintain proper posture while working at a desk all day? My back is killing me and I\'m worried it\'s affecting my height potential.',
    heightTag: '#posture',
    likeCount: 18,
    commentCount: 7,
    liked: true,
    saved: true,
    images: [],
    comments: [
      {
        id: '203',
        user: {
          id: '105',
          name: 'James Wilson',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        text: 'I use a standing desk and set a timer to remind me to check my posture every 30 minutes. Game changer!',
        createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
      }
    ]
  },
  {
    id: '3',
    user: {
      id: '106',
      name: 'Alex Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    text: 'Just completed the 7-day posture reset challenge! My measurements show I\'m standing 0.25" taller already. The exercises were tough but worth it.',
    heightTag: '183 cm',
    likeCount: 42,
    commentCount: 12,
    liked: false,
    saved: false,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
    ],
    comments: [
      {
        id: '204',
        user: {
          id: '107',
          name: 'Olivia Martinez',
          avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
        },
        text: 'Which challenge did you do? I want to try it!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
      }
    ]
  }
];
