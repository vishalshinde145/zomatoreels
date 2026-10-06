import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFoodPartnerById } from '../api'

interface PartnerInfo {
  fullname: string
  email: string
  profilePic?: string
  id?: string | number
}

interface VideoItem {
  id: string | number
  name?: string
  video: string
  likes?: number
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1482);
  const [activeTab, setActiveTab] = useState<'reels' | 'products'>('reels');
  const [selectedReel, setSelectedReel] = useState<VideoItem | null>(null);
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalMuted, setModalMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (id) loadProfile(id);
  }, [id])

  async function loadProfile(partnerId: string) {
    setLoading(true)
    try {
      const response = await getFoodPartnerById(partnerId);
      if (response.foodpartner) {
        setPartnerInfo(response.foodpartner);
        setVideos(response.videos || []);
      }
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  }

  const toggleFollow = () => {
    setIsFollowing(prev => {
      const nextState = !prev;
      setFollowersCount(count => (nextState ? count + 1 : count - 1));
      return nextState
    })
  }

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setModalPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setModalPlaying(false);
    }
  }

  const toggleModalMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted
    setModalMuted(modalVideoRef.current.muted);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center z-50 text-white font-medium text-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-400">Loading Profile...</p>
        </div>
      </div>
    )
  }

  const restaurantName = partnerInfo?.fullname || 'Restaurant'
  const avatarUrl =
    partnerInfo?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurantName)}&background=e11d48&color=fff&size=200&bold=true`

  return (
    <div className="h-screen w-screen bg-neutral-950 flex justify-center items-center overflow-hidden p-0 sm:py-3 select-none">
      {/* Centered Mobile Card (matches Home page mobile frame on desktop) */}
      <div className="relative w-full sm:max-w-[420px] h-full sm:h-[94vh] sm:max-h-[850px] sm:aspect-[9/16] sm:rounded-2xl overflow-hidden bg-black text-white border border-white/10 shadow-2xl flex flex-col">
        {/* Top Sticky Navigation Bar */}
        <nav className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium text-sm transition-colors cursor-pointer group"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
            <span className="text-xs sm:text-sm font-semibold">Reels</span>
          </button>

          <div className="flex items-center gap-1.5 font-bold text-sm">
            <span className="truncate max-w-[180px]">{restaurantName}</span>
            <svg className="w-4 h-4 fill-sky-500 inline-block shrink-0" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: restaurantName, url: window.location.href }).catch(() => {})
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Profile link copied to clipboard!')
              }
            }}
            className="p-1 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
            title="Share Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </nav>

        {/* Scrollable Mobile Feed Body */}
        <div className="flex-1 overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <main className="px-4 pt-4">
            {/* Instagram Profile Header */}
            <section className="flex flex-col gap-4 pb-4 border-b border-neutral-800/80">
              {/* Top Row: Avatar & Stats */}
              <div className="flex items-center justify-between gap-4">
                {/* Avatar with Instagram Gradient Ring */}
                <div className="relative group shrink-0">
                  <div className="p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 rounded-full shadow-lg">
                    <div className="p-[2px] bg-black rounded-full">
                      <img
                        src={avatarUrl}
                        alt={restaurantName}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Row: Videos & Followers only */}
                <div className="flex-1 flex justify-around text-center py-1">
                  <div>
                    <span className="block font-bold text-white text-base leading-tight">{videos.length}</span>
                    <span className="text-[11px] text-neutral-400">videos</span>
                  </div>
                  <div>
                    <span className="block font-bold text-white text-base leading-tight">
                      {followersCount.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-neutral-400">followers</span>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="text-xs space-y-1">
                <div className="font-bold text-white text-sm flex items-center gap-1">
                  <span>{restaurantName}</span>
                  <svg className="w-3.5 h-3.5 fill-sky-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <p className="text-neutral-400 font-medium">🍽️ Restaurant & Food Partner</p>
                <p className="text-neutral-200 leading-snug">
                  Freshly crafted culinary delights & chef specialties. Dive into our reels! 🍕🍜
                </p>
                <p className="text-neutral-400 pt-0.5 flex items-center gap-1">
                  <span>📧</span>
                  <a href={`mailto:${partnerInfo?.email}`} className="text-sky-400 hover:underline">
                    {partnerInfo?.email || 'contact@restaurant.com'}
                  </a>
                </p>
              </div>

              {/* Action Buttons: Follow, Message */}
              <div className="flex items-center gap-2 pt-1 w-full">
                {/* Follow Button */}
                <button
                  onClick={toggleFollow}
                  className={`flex-1 font-semibold text-xs py-2 rounded-lg transition-all cursor-pointer shadow-md ${
                    isFollowing
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                      : 'bg-[#0095F6] hover:bg-[#1877F2] text-white active:scale-95'
                  }`}
                >
                  {isFollowing ? 'Following ✓' : 'Follow'}
                </button>

                {/* Message Button */}
                <button
                  onClick={() => alert(`Direct message feature for ${restaurantName} coming soon!`)}
                  className="flex-1 font-semibold text-xs py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700 cursor-pointer active:scale-95"
                >
                  Message
                </button>
              </div>
            </section>

            {/* Profile Tabs Navigation: Exactly 2 Tabs (Reels & Products) */}
            <div className="border-t border-neutral-800 flex justify-around text-xs tracking-wider uppercase font-semibold">
              <button
                onClick={() => setActiveTab('reels')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-t-2 -mt-[1px] transition-all cursor-pointer ${
                  activeTab === 'reels'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {/* Reels Clapboard Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="m19.43 5.48-2.86-2.86a2 2 0 0 0-2.83 0L3.25 13.11a2 2 0 0 0 0 2.83l2.86 2.86a2 2 0 0 0 2.83 0l10.49-10.49a2 2 0 0 0 0-2.83ZM8.2 16.69l-2.12-2.12 7.78-7.78 2.12 2.12L8.2 16.69Z" />
                </svg>
                <span>Reels</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-t-2 -mt-[1px] transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {/* Products / Menu Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
                </svg>
                <span>Products</span>
              </button>
            </div>

            {/* Video Grid (NO AUTOPLAY, Hover Preview & Click to Open) */}
            {activeTab === 'reels' && (
              <div className="grid grid-cols-3 gap-1 pt-1.5 pb-6">
                {videos.length > 0 ? (
                  videos.map(video => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedReel(video)}
                      className="aspect-[9/16] bg-neutral-900 rounded overflow-hidden relative group cursor-pointer border border-neutral-800/60 shadow-sm"
                    >
                      {/* Video Thumbnail (NO AUTOPLAY: pauses on default, plays on hover) */}
                      <video
                        src={video.video}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={e => {
                          e.currentTarget.play().catch(() => {})
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.pause()
                          e.currentTarget.currentTime = 0
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Reel Icon & Likes Badge */}
                      <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 text-white text-[11px] font-semibold drop-shadow-md bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>{video.likes || 0}</span>
                      </div>

                      {/* Hover Overlay with Food Name */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 pointer-events-none">
                        {video.name && (
                          <p className="text-white text-[10px] font-semibold drop-shadow line-clamp-2">
                            {video.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center text-neutral-500 gap-2">
                    <span className="text-2xl">📹</span>
                    <h3 className="text-white font-bold text-sm">No Reels Uploaded Yet</h3>
                    <p className="text-[11px] text-neutral-400 max-w-[200px]">
                      This restaurant hasn't uploaded any reels yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab View */}
            {activeTab === 'products' && (
              <div className="flex flex-col gap-2 pt-2 pb-6">
                {videos.length > 0 ? (
                  videos.map(item => (
                    <div
                      key={item.id}
                      className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 flex items-center gap-3 hover:border-neutral-700 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                        <video
                          src={item.video}
                          muted
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                          {item.name || 'Signature Food Dish'}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Freshly prepared • {item.likes || 0} likes
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedReel(item)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95"
                      >
                        View Reel
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-neutral-500 gap-2">
                    <span className="text-2xl">🛍️</span>
                    <h3 className="text-white font-bold text-sm">No Products Listed</h3>
                    <p className="text-[11px] text-neutral-400 max-w-[200px]">
                      Menu products will appear here once dishes are added.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Instagram Reel Modal Player */}
      {selectedReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedReel(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedReel(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/60 hover:bg-black/80 p-2.5 rounded-full transition-all cursor-pointer z-50 text-base leading-none"
            title="Close"
          >
            ✕
          </button>

          {/* Modal Reel Card */}
          <div
            className="relative w-full max-w-[390px] h-[85vh] max-h-[750px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl border border-white/10 flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Video Player */}
            <video
              ref={modalVideoRef}
              src={selectedReel.video}
              autoPlay
              loop
              playsInline
              onClick={toggleModalPlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Play/Pause Overlay indicator */}
            {!modalPlaying && (
              <div
                onClick={toggleModalPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer pointer-events-auto"
              >
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-xl">
                  ▶
                </div>
              </div>
            )}

            {/* Sound Toggle Button */}
            <button
              onClick={toggleModalMute}
              className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white p-2.5 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Toggle mute"
            >
              <span className="text-sm">{modalMuted ? '🔇' : '🔊'}</span>
            </button>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <img
                  src={avatarUrl}
                  alt={restaurantName}
                  className="w-7 h-7 rounded-full object-cover border border-white/80"
                />
                <span className="font-bold text-xs sm:text-sm text-white">{restaurantName}</span>
              </div>
              {selectedReel.name && (
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-snug drop-shadow line-clamp-2">
                  {selectedReel.name}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-neutral-300 pt-0.5">
                <span>❤️ {selectedReel.likes || 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
