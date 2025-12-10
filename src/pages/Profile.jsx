import React, { useState, useEffect } from "react";
import "./Profile.css";

const StudentProfile = () => {
  const [userID, setUserID] = useState("Loading...");
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/default-profile.png");
  const [coverPhoto] = useState("/default-cover.jpg"); // ← SAME COVER FOR ALL STUDENTS
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (!id) return;
    setUserID(id);

    fetch(`http://localhost:5000/api/profile/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const name = data.username?.trim() || id;
        const photo = data.userImg && data.userImg.trim() ? data.userImg : "/default-profile.png";

        setFullName(name);
        setProfilePhoto(photo);
        localStorage.setItem(`student_name_${id}`, name);
        localStorage.setItem(`student_profile_${id}`, photo === "/default-profile.png" ? "" : photo);
      })
      .catch(() => {
        const savedName = localStorage.getItem(`student_name_${id}`) || id;
        const savedPhoto = localStorage.getItem(`student_profile_${id}`);
        setFullName(savedName);
        setProfilePhoto(savedPhoto && savedPhoto !== "" ? savedPhoto : "/default-profile.png");
      });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfilePhoto(base64);
      localStorage.setItem(`student_profile_${userID}`, base64);
      fetch("http://localhost:5000/api/profile/update-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber: userID, imageBase64: base64 }),
      }).catch(() => {});
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (!tempName.trim()) return;
    const name = tempName.trim();
    setFullName(name);
    localStorage.setItem(`student_name_${userID}`, name);
    setIsEditingName(false);
    fetch("http://localhost:5000/api/profile/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idNumber: userID, username: name }),
    }).catch(() => {});
  };

  return (
    <div className="profile-page">
      {/* ← THIS WAS MISSING! NOW ADDED → BIG BEAUTIFUL COVER */}
      <div className="cover-photo-section">
        <img src="/default-cover.jpg" alt="Cover" className="cover-photo" />
        {/* Students can't change cover → no button */}
      </div>

      <div className="profile-info">
        <div className="profile-pic-wrapper">
          <div className="profile-circle">
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="profile-pic-img" 
              onError={e => e.target.src = "/default-profile.png"} 
            />
          </div>
          <label htmlFor="photoUpload" className="change-btn-staff-style">Change</label>
          <input id="photoUpload" type="file" accept="image/*" onChange={handlePhotoChange} style={{display: "none"}} />
        </div>

        <div className="user-details">
          {isEditingName ? (
            <div className="name-edit-mode">
              <input 
                type="text" 
                value={tempName} 
                onChange={e => setTempName(e.target.value)} 
                placeholder="Enter your name" 
                autoFocus 
                onKeyDown={e => e.key === "Enter" && saveName()}
              />
              <div className="name-actions">
                <button onClick={saveName}>Save</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h2 
                className="display-name" 
                onClick={() => { 
                  setTempName(fullName || userID);
                  setIsEditingName(true); 
                }}
              >
                {fullName || userID} <span className="edit-pencil">Edit</span>
              </h2>
              <p className="user-id-big">User ID: {userID}</p>
            </>
          )}
          <p className="user-role">Cordova Public College • Student Account</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;