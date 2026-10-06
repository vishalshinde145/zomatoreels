import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { addFood } from '../api'

export default function CreateFood() {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [foodName, setFoodName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  function onVideoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedVideoFile(file)
      setVideoPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedVideoFile || !foodName) {
      alert('Please fill all fields and select a video.')
      return
    }
    const foodPartnerId = localStorage.getItem('foodPartnerId')
    if (!foodPartnerId) {
      alert('Session expired. Please login again.')
      navigate('/partner-login')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('video', selectedVideoFile)
    formData.append('name', foodName)
    formData.append('foodPartnerId', foodPartnerId)

    try {
      await addFood(formData)
      alert('Food added successfully!')
      navigate(`/profile/${foodPartnerId}`)
    } catch (err: any) {
      alert('Failed to add food: ' + (err?.message || 'Internal server error'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-neutral-950 flex justify-center items-center overflow-hidden p-0 sm:py-3 select-none">
      {/* Centered Mobile Card */}
      <div className="relative w-full sm:max-w-[420px] h-full sm:h-[94vh] sm:max-h-[850px] sm:aspect-[9/16] sm:rounded-2xl overflow-hidden bg-black text-white border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <nav className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium text-sm transition-colors cursor-pointer group"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
            <span className="text-xs sm:text-sm font-semibold">Back</span>
          </button>
          <h2 className="font-bold text-sm sm:text-base">Share Your Dish</h2>
          <div className="w-10"></div>
        </nav>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="mb-5 text-center">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
              New Food Reel
            </h1>
            <p className="text-neutral-400 text-xs">
              Upload a reel and tell customers about your delicious food
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Video Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Food Reel Video
              </label>
              <div className="relative w-full aspect-[9/12] border-2 border-dashed border-neutral-700 hover:border-rose-500 rounded-xl flex flex-col justify-center items-center cursor-pointer overflow-hidden bg-neutral-900/60 transition-all duration-200">
                <input
                  type="file"
                  id="videoInput"
                  accept="video/*"
                  onChange={onVideoSelected}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {!videoPreviewUrl ? (
                  <div className="flex flex-col items-center text-neutral-400 gap-2 p-4 text-center">
                    <svg className="w-10 h-10 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <span className="text-xs font-medium">Tap or drag video to upload</span>
                  </div>
                ) : (
                  <video src={videoPreviewUrl} className="w-full h-full object-cover" controls />
                )}
              </div>
            </div>

            {/* Food Name */}
            <div>
              <label htmlFor="foodName" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Dish Name / Caption
              </label>
              <input
                id="foodName"
                type="text"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                placeholder="e.g. Butter Chicken Special"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-sm focus:outline-none focus:border-rose-500 transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-600/25 transition duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? 'Uploading Video...' : 'Post Food Reel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
