import { useState, useEffect } from 'react';
import { useStateContext } from "../context/index";
import Nftdetails from './NFTdetaile'; 


export default function Followlist({ followlist }) {
  const { MyNFT,getMyProfile,setopenNFtdetail,openNFTdetail,setimgurl,imgurl } = useStateContext(); 
  const [followedProfiles, setFollowedProfiles] = useState([]); 
 
  useEffect(() => {
    const fetchFollowedProfiles = async () => {
      const profilesWithNFTs = await Promise.all(
        followlist.map(async (address) => {
          const profile = await getMyProfile(address);
          const nfts = await MyNFT(address);
          return {
            profile,
            latestNFT: nfts[nfts.length - 1],  
          };
        })
      );
      setFollowedProfiles(profilesWithNFTs); 
    };

    if (followlist.length > 0) {
      fetchFollowedProfiles();  
    }
  }, [followlist]);
  
  return (
    <div style={pageContainerStyle}>
    <div style={scrollContainerStyle}>
    <div style={containerStyle}>
      {followedProfiles.length > 0 ? (
        followedProfiles.map((profileData, index) => (
          <div key={index} className="followed-profile-card" style={cardStyle}>
            <h3>{profileData.profile.name}</h3> 
            {profileData.latestNFT ? (
            <div onClick={() => {
              setimgurl(profileData.latestNFT); 
              setopenNFtdetail(!openNFTdetail); 
            }}>
             <img src={profileData.latestNFT} alt="Not Found" style={Nftstyle}/> 
            </div> 
           ) : (
           <p>No NFTs yet</p> 
           )}
          </div>
        ))
      ) : (
        <p>You Not Follow Anyone</p>  
      )}
    </div>
   </div>
  </div>
  

  );
}

const pageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '60vh', 
};

const scrollContainerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  width: '90%', 
  maxWidth: '300px', 
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', 
};

const Nftstyle ={
    width: '100%',
    borderRadius: '10px',
}
