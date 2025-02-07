import { useState, useEffect } from 'react';
import { useStateContext } from "../context/index";
import { useNavigate } from 'react-router-dom';
import Followlist from './followlist' ;
import Nftdetails from './NFTdetaile';

export default function Home() {
  const { 
    getProfilebyName, 
    Follow, 
    Unfollow, 
    FollowingList,
    SelectedAccount, 
    getMyProfile, 
    FollowingStatus,
    setopenNFtdetail,
    setimgurl,
    imgurl,
    openNFTdetail } = useStateContext(); 

  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchedProfiles, setSearchedProfiles] = useState([]); 
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [listFollow, setListFollow] = useState([]);
  const [followStatuses, setFollowStatuses] = useState({});  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowingList = async () => {
      if (SelectedAccount) {
        const List = await FollowingList(); 
        if (List) {
          setListFollow(List); 
        }
      } else {
        console.log("Connect your Wallet");
      }
    };
    fetchFollowingList(); 
  }, [SelectedAccount]);

  const handleSearch = async () => {
    let matchingProfiles;  
    if (searchQuery.startsWith("0x") && searchQuery.length === 42) {
      const profile = await getMyProfile(searchQuery);
      matchingProfiles = profile ? [profile] : [];
    } else {
      matchingProfiles = await getProfilebyName(searchQuery);
    }
    setSearchedProfiles(matchingProfiles);
    setShowSearchResults(true);

    const followStatusPromises = matchingProfiles.map(profile => FollowingStatus(profile.Address));
    const statuses = await Promise.all(followStatusPromises);
    
    const statusObj = matchingProfiles.reduce((acc,profile,index) => {
      acc[profile.Address] = statuses[index];
      return acc;
    },{});
    setFollowStatuses(statusObj);  
  };

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.Address}`); 
  };

  const handleFollowClick = async (event, profile) => {
    event.stopPropagation();
    if (followStatuses[profile.Address]) {
      await Unfollow(profile.Address);
    } else {
      await Follow(profile.Address);
    }
    
    const updatedStatus = await FollowingStatus(profile.Address);
    setFollowStatuses(prev => ({
      ...prev,
      [profile.Address]: updatedStatus
    }));
  };

  return (
    <div>
      <h1>Social Media DApp</h1>
      <div>
        <input
          type="text"
          placeholder="Enter name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button> 
      </div>
     
      {showSearchResults && (
        <div>
          <h2>Search Results</h2>
          {searchedProfiles.length > 0 ? (
          <div>
            <div style={containerStyle}>
              {searchedProfiles.map((profile, index) => (
                <div key={index} className="nft-card" style={cardStyle}  
                onClick={() => handleProfileClick(profile)}>
                  <p>
                    Name: {profile.name} 
                    Address: {`${profile.Address?.slice(0, 6)}...`}
                    <button onClick={(event) => handleFollowClick(event, profile)}>
                      {followStatuses[profile.Address] ? "Unfollow" : "Follow"}
                    </button>
                  </p>
                </div>
              ))}
            </div>
          </div>
          ) : (
            <p>No profiles found</p> 
          )}
        </div>
      )}
       {openNFTdetail && (<Nftdetails imgurls={imgurl}/>)}
      <div>
        <Followlist followlist={listFollow}/>
      </div>
      
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',  
  alignItems: 'center',      
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  width: '400px',
  padding: '0.5px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};
