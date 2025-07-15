import React from 'react';

const ProfileCard = ({ profile, onSwipe }) => {
    return (
        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
                <img
                    className="w-full h-64 object-cover"
                    src={profile.photos[0]?.url || 'https://via.placeholder.com/400'}
                    alt={`${profile.firstName} ${profile.lastName}`}
                />
            </div>
            
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {profile.firstName} {profile.lastName}
                    </h2>
                    <span className="text-gray-600">
                        {profile.role === 'recruiter' ? 'Recruteur' : 'Candidat'}
                    </span>
                </div>

                {profile.role === 'recruiter' && (
                    <div className="mt-2">
                        <p className="text-gray-600">{profile.recruiterProfile?.company}</p>
                        <p className="text-gray-600">{profile.recruiterProfile?.position}</p>
                    </div>
                )}

                {profile.role === 'candidate' && (
                    <div className="mt-2">
                        <p className="text-gray-600">{profile.candidateProfile?.desiredPosition}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {profile.candidateProfile?.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={() => onSwipe('dislike')}
                        className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                    >
                        ✕
                    </button>
                    <button
                        onClick={() => onSwipe('like')}
                        className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
                    >
                        ✓
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard; 