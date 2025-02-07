import { useStateContext } from "../context/index";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import NFTcard from "./NFT_card";

export default function Profile() {
  const { getMyProfile, connectWallet, Follow, Unfollow, FollowingStatus } = useStateContext();
  const [MyProfiles, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);  
  const { Address } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await connectWallet();  
        if (Address) {
          const profile = await getMyProfile(Address);  
          setProfile(profile || {});

          const status = await FollowingStatus(Address);  
          setIsFollowing(status);  
        } else {
          console.log("Connect your Wallet");
        }
      } catch (error) {
        console.log(error);
      }
    };  
    fetchProfile();
  }, [Address]);

 
  const handleFollowClick = async () => {
    if (isFollowing) {
      await Unfollow(Address);  
    } else {
      await Follow(Address);    
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div>
      {MyProfiles ? (
        <>
          <h2>Profile Details</h2>
          <div>
            Name: {MyProfiles.name} <br />
            Age: {MyProfiles.age} <br />
            Address: {Address}<br />
            <button onClick={handleFollowClick}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <h2>Owned NFTs</h2>
          <NFTcard account={Address} />
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
