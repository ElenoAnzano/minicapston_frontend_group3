import React, { useState, useEffect } from "react";
import "./StaffProfile.css";

const StaffProfile = () => {
  const [userID, setUserID] = useState("Loading...");
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/default-profile.png");
  const [coverPhoto, setCoverPhoto] = useState("/default-cover.jpg");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (!id) return;

    setUserID(id);

    // Always fetch fresh from NeonDB first
    fetch(`http://localhost:5000/api/profile/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Offline"))
      .then(data => {
        const name = data.username?.trim() || id;
        const photo = data.userImg && data.userImg.trim() !== "" 
          ? data.userImg 
          : "/default-profile.png";  // ← NULL → default

        setFullName(name);
        setProfilePhoto(photo);

        // Now save to localStorage (overwrite old frog!)
        localStorage.setItem(`staff_name_${id}`, name);
        localStorage.setItem(`staff_profile_${id}`, photo === "/default-profile.png" ? "" : photo);
      })
      .catch(() => {
        // Offline → use localStorage (but clean nulls)
        const savedName = localStorage.getItem(`staff_name_${id}`) || id;
        const savedPhoto = localStorage.getItem(`staff_profile_${id}`);

        setFullName(savedName);
        setProfilePhoto(savedPhoto && savedPhoto !== "null" && savedPhoto !== "" 
          ? savedPhoto 
          : "/default-profile.png");
      });

    // Load cover (local only)
    const savedCover = localStorage.getItem(`staff_cover_${id}`);
    if (savedCover) setCoverPhoto(savedCover);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfilePhoto(base64);
      localStorage.setItem(`staff_profile_${userID}`, base64);

      fetch("http://localhost:5000/api/profile/update-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber: userID, imageBase64: base64 }),
      }).catch(() => console.log("Photo saved locally"));
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setCoverPhoto(base64);
      localStorage.setItem(`staff_cover_${userID}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (!tempName.trim()) return;
    const name = tempName.trim();
    setFullName(name);
    localStorage.setItem(`staff_name_${userID}`, name);
    setIsEditingName(false);

    fetch("http://localhost:5000/api/profile/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idNumber: userID, username: name }),
    }).catch(() => {});
  };

  return (
    <div className="profile-page">
      <div className="cover-photo-section">
        <img src="/default-cover.jpg" alt="Cover" className="cover-photo" />
        <label htmlFor="coverUpload" className="upload-cover-btn">Change Cover</label>
        <input id="coverUpload" type="file" accept="image/*" onChange={handleCoverChange} style={{display: "none"}} />
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
                onClick={() => { setTempName(fullName); setIsEditingName(true); }}
              >
                {fullName || userID}
                <span className="edit-pencil">Edit</span>
              </h2>
              <p className="user-id-big">Staff ID: {userID}</p>
            </>
          )}
          <p className="user-role">Cordova Public College • Staff Account</p>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;