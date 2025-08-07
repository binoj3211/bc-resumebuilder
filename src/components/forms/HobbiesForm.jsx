import React from 'react'
import { Heart, Plus, X } from 'lucide-react'

const HobbiesForm = ({ data = [], onChange }) => {
  const addHobby = () => {
    onChange([...data, ''])
  }

  const removeHobby = (index) => {
    const newHobbies = data.filter((_, i) => i !== index)
    onChange(newHobbies)
  }

  const updateHobby = (index, value) => {
    const newHobbies = data.map((hobby, i) => 
      i === index ? value : hobby
    )
    onChange(newHobbies)
  }

  const commonHobbies = [
    'Reading', 'Writing', 'Photography', 'Travel', 'Hiking', 'Cooking',
    'Music', 'Sports', 'Volunteering', 'Gaming', 'Painting', 'Dancing',
    'Gardening', 'Fitness', 'Yoga', 'Swimming', 'Chess', 'Cycling',
    'Running', 'Rock Climbing', 'Skiing', 'Surfing', 'Martial Arts',
    'Playing Guitar', 'Learning Languages', 'Meditation', 'Blogging'
  ]

  const addCommonHobby = (hobby) => {
    if (!data.includes(hobby)) {
      onChange([...data, hobby])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Hobbies & Interests
          </h3>
          <p className="text-sm text-gray-600">Add personal interests that showcase your personality and character</p>
        </div>
        <button
          type="button"
          onClick={addHobby}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Hobby</span>
        </button>
      </div>

      {/* Current Hobbies */}
      {data.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Your Hobbies & Interests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.map((hobby, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  value={hobby}
                  onChange={(e) => updateHobby(index, e.target.value)}
                  placeholder="Enter a hobby or interest"
                  className="flex-1 bg-transparent border-none outline-none text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => removeHobby(index)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Hobbies Suggestions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Popular Hobbies & Interests</h4>
        <p className="text-sm text-gray-600">Click to add any that apply to you</p>
        <div className="flex flex-wrap gap-2">
          {commonHobbies.map((hobby) => (
            <button
              key={hobby}
              type="button"
              onClick={() => addCommonHobby(hobby)}
              disabled={data.includes(hobby)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                data.includes(hobby)
                  ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              {hobby}
              {data.includes(hobby) && <span className="ml-1">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hobbies added yet</p>
          <p className="text-sm">Add some interests to show your personality</p>
        </div>
      )}
    </div>
  )
}

export default HobbiesForm
