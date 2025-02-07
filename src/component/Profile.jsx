import { useStateContext } from "../context/index";
import { useEffect, useState } from "react";
import NFTcard from "./NFT_card";

export default function Profile (){
  const { SelectedAccount, createProfile, getMyProfile, connectWallet } = useStateContext();
  const [name , setName] = useState("");
  const [age, setAge] = useState("");
  const [MyProfiles, setProfile] = useState(null);

  useEffect(() => {
    const MyProfile = async () => {
      try {
        await connectWallet();
        if (SelectedAccount) {
          const Profile = await getMyProfile(SelectedAccount);
          setProfile(Profile || {});
        } else {
          console.log("Connect your Wallet");
        }
      } catch (error) {
        console.log(error);
      }
    };  
    MyProfile();
  }, [SelectedAccount]);

  return (
    <div>
    {MyProfiles && MyProfiles.name ? (
      <div>
        <h2>MyProfile</h2>
        <div>
          Name: {MyProfiles.name} <br />
          Age: {MyProfiles.age} <br />
          Address: {MyProfiles.Address}
        </div>
        <h2>MyNFT</h2>
        <NFTcard account={SelectedAccount}/>
      </div>
    ) : (
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br />
        <button onClick={() => createProfile(name, age)}>Create Profile</button>
      </div>
    )}
  </div> 
  );
}