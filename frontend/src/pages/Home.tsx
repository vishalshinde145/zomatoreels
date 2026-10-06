import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listFood, likeFood } from '../api';

interface CommentItem {
  id: string;
  user: string;
  text: string;
  time: string;
}

interface VideoItem {
  id: number | string;
  video: string;
  name: string;
  likes: number;
  foodPartnerId: string | number;
  restaurantName?: string;
}

const initialComments: Record<string | number, CommentItem[]> = {
  default: [
    { id: '1', user: 'Foodie_Rahul', text: 'This looks so tempting! 😍 Craving this right now.', time: '2h ago' },
    { id: '2', user: 'Priya Eats', text: 'Where is this restaurant located? Must visit this weekend! 🔥', time: '1h ago' },
    { id: '3', user: 'ChefAmit', text: 'The presentation is top-notch 👨‍🍳✨', time: '30m ago' },
  ]
};

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);
  const [mutedStates, setMutedStates] = useState<boolean[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string | number>>(new Set());
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string | number, CommentItem[]>>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoading(true);
    try {
      const response = await listFood();
      if (response.success) {
        const data: VideoItem[] = response.data;
        setVideos(data);
        setPlayingStates(data.map(() => false));
        setMutedStates(data.map(() => true));
        videoRefs.current = data.map(() => null);
      }
    } catch (err) {
      console.error('Failed to load videos', err);
    } finally {
      setLoading(false);
    }
  }

  const togglePlay = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play().catch(err => console.warn('Play failed', err));
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRefs.current[index]
    if (!video) return
    video.muted = !video.muted
    setMutedStates(prev => {
      const next = [...prev]
      next[index] = video.muted
      return next
    })
  }, [])

  const handlePlayStateChange = useCallback((index: number, isPlaying: boolean) => {
    setPlayingStates(prev => {
      const next = [...prev]
      next[index] = isPlaying
      return next
    })
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  async function handleLike(video: VideoItem, index: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToast('Please login to like food');
      return;
    }

    try {
      const response = await likeFood(video.id);
      if (response.success) {
        const isLiked = response.liked;

        setVideos(prev => {
          const next = [...prev];
          next[index] = {
            ...next[index],
            likes: isLiked ? next[index].likes + 1 : Math.max(0, next[index].likes - 1)
          };
          return next;
        });

        setLikedVideoIds(prev => {
          const next = new Set(prev);
          if (isLiked) {
            next.add(video.id);
          } else {
            next.delete(video.id);
          }
          return next;
        });
      }
    } catch (err: any) {
      console.error('Failed to like food', err);
      showToast(err?.message || 'Failed to like food');
    }
  }

  const handleAddComment = (videoId: string | number) => {
    if (!newCommentText.trim()) return;
    const currentList = commentsMap[videoId] || commentsMap['default'] || [];
    const created: CommentItem = {
      id: Date.now().toString(),
      user: 'You',
      text: newCommentText.trim(),
      time: 'Just now',
    };
    setCommentsMap(prev => ({
      ...prev,
      [videoId]: [...currentList, created],
    }));
    setNewCommentText('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col justify-center items-center z-50 text-white font-medium text-lg gap-3">
        <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Loading reels...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 z-50 pointer-events-none transition-all duration-300">
          <span>⚠️</span> {toastMessage}
        </div>
      )}

      {videos.map((video, i) => {
        const isCommentsOpen = activeCommentVideoId === video.id;
        const videoComments = commentsMap[video.id] || commentsMap['default'] || [];

        return (
          <div
            key={video.id}
            className="h-screen w-full snap-start flex justify-center items-center bg-black p-0 sm:p-3 select-none relative"
          >
            {/* Flex container holding centered reel and optional right-side comment drawer */}
            <div className="flex items-center justify-center gap-4 w-full max-w-5xl h-full sm:h-[94vh] sm:max-h-[850px]">
              {/* Centered Reel Card (9:16 aspect ratio on desktop) */}
              <div
                className="relative w-full sm:max-w-[420px] h-full sm:aspect-[9/16] sm:rounded-2xl overflow-hidden bg-neutral-950 flex justify-center items-center cursor-pointer shadow-2xl border border-white/10 shrink-0"
                onClick={() => togglePlay(i)}
              >
                <video
                  className="h-full w-full object-cover"
                  src={video.video}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  ref={el => { videoRefs.current[i] = el }}
                  onPlay={() => handlePlayStateChange(i, true)}
                  onPause={() => handlePlayStateChange(i, false)}
                />

                {/* Centered Play/Pause Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-200 ${!playingStates[i] ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl shadow-2xl">
                    ▶
                  </div>
                </div>

                {/* Actions (Like, Comment, Mute) */}
                <div
                  className="flex flex-col items-center gap-3.5 absolute right-3 bottom-24 sm:right-4 sm:bottom-28 z-20 pointer-events-auto"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Mute/Unmute */}
                  <button
                    className="flex flex-col items-center justify-center text-white bg-black/40 backdrop-blur-md p-2.5 rounded-full cursor-pointer transition-transform active:scale-90 hover:scale-105 border border-white/10"
                    onClick={e => toggleMute(i, e)}
                    title="Toggle mute"
                  >
                    <span className="text-lg leading-none">{mutedStates[i] ? '🔇' : '🔊'}</span>
                  </button>

                  {/* Like Button */}
                  <button
                    className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md px-2.5 py-2 rounded-full cursor-pointer transition-transform active:scale-90 hover:scale-105"
                    onClick={() => handleLike(video, i)}
                    title="Like"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-7 h-7 transition-all duration-200 ${
                        likedVideoIds.has(video.id)
                          ? 'fill-red-500 scale-110'
                          : 'fill-white'
                      }`}
                    >
                      <path
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    <span className="text-xs font-bold mt-1 text-white">{video.likes}</span>
                  </button>

                  {/* Comment Button (Below like button) */}
                  <button
                    className={`flex flex-col items-center justify-center bg-black/40 backdrop-blur-md px-2.5 py-2 rounded-full cursor-pointer transition-transform active:scale-90 hover:scale-105 ${
                      isCommentsOpen ? 'bg-white/20 scale-105' : ''
                    }`}
                    onClick={() => setActiveCommentVideoId(isCommentsOpen ? null : video.id)}
                    title="Comments"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-7 h-7 fill-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9s-4.428-9-9.75-9c-5.322 0-9.75 3.97-9.75 9 0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .444 1.223ZM8.25 10.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-bold mt-1 text-white">{videoComments.length}</span>
                  </button>
                </div>

                {/* Reel UI Overlay (Bottom Info: Restaurant Profile, Name & Caption) */}
                <div
                  className="absolute bottom-0 inset-x-0 p-4 sm:p-5 pt-16 z-10 text-white flex flex-col gap-2 pointer-events-auto bg-gradient-to-t from-black/90 via-black/45 to-transparent pr-16"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Restaurant Profile Picture and Restaurant Name */}
                  <div
                    className="flex items-center gap-2.5 cursor-pointer group w-fit"
                    onClick={() => navigate(`/profile/${video.foodPartnerId}`)}
                  >
                    {/* Small profile picture of restaurant */}
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.restaurantName || 'Restaurant')}&background=e11d48&color=fff&bold=true`}
                      alt={video.restaurantName || 'Restaurant'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/80 shadow-md group-hover:scale-105 transition-transform"
                    />
                    {/* Restaurant Name */}
                    <span className="font-bold text-sm sm:text-base text-white group-hover:text-rose-400 transition-colors drop-shadow">
                      {video.restaurantName || `Restaurant #${video.foodPartnerId}`}
                    </span>
                  </div>

                  {/* Video Caption below Profile Picture & Restaurant Name */}
                  <p className="text-sm sm:text-base font-medium leading-snug drop-shadow line-clamp-2 text-white/95 pl-0.5">
                    {video.name}
                  </p>
                </div>
              </div>

              {/* Comment Section (Right side of video playback) */}
              {isCommentsOpen && (
                <div
                  className="fixed sm:static inset-y-0 right-0 z-50 w-full sm:w-[360px] md:w-[390px] h-full sm:h-full bg-neutral-900/95 sm:bg-neutral-900/90 backdrop-blur-2xl border-l sm:border border-white/10 sm:rounded-2xl flex flex-col shadow-2xl transition-all duration-300"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-base sm:text-lg">Comments</h3>
                      <span className="text-xs px-2 py-0.5 bg-white/10 text-white/80 rounded-full font-semibold">
                        {videoComments.length}
                      </span>
                    </div>
                    <button
                      className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-base leading-none"
                      onClick={() => setActiveCommentVideoId(null)}
                      title="Close comments"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Comment List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {videoComments.map(c => (
                      <div key={c.id} className="flex items-start gap-3 text-sm">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.user)}&background=random&color=fff&size=36`}
                          alt={c.user}
                          className="w-8 h-8 rounded-full shrink-0 border border-white/10 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-white text-xs sm:text-sm">{c.user}</span>
                            <span className="text-[11px] text-white/40">{c.time}</span>
                          </div>
                          <p className="text-white/85 text-xs sm:text-sm mt-0.5 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div className="p-3 border-t border-white/10 bg-neutral-950/40">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddComment(video.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-full text-xs sm:text-sm transition-all cursor-pointer shadow-md"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}
