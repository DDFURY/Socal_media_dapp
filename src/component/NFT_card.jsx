import { useState, useEffect } from 'react';
import { useStateContext } from '../context/index';
import Nftdetails from './NFTdetaile';
import axios from 'axios';

export default function NFTcard({ account }) {
  const { MyNFT, connectWallet, setopenNFtdetail, openNFTdetail, setimgurl, imgurl,SelectedAccount } = useStateContext();
  const [NFTArry, setNFTArry] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");

  const navigate = (NFT) => {
    setimgurl(NFT);
    setopenNFtdetail(true);
  };

  useEffect(() => {
    const AllMyNFT = async () => {
      try {
        await connectWallet();
        if (account) {
          const NFTList = await MyNFT(account);
          setNFTArry(NFTList || []);

          // Fetch likes and comments for each NFT
          const data = await Promise.all(
            NFTList.map(async (NFT) => {
              try {
                const res = await axios.get(`http://localhost:3000/api/nft/${NFT}`);
                return { id: NFT, ...res.data };
              } catch (error) {
                console.error(`Failed to fetch data for NFT ${NFT}:`, error.message);
                return { id: NFT, likes: 0, comments: [] }; // Default values for missing NFTs
              }
            })
          );

          const likesData = {};
          const commentsData = {};

          data.forEach(({ id, likes, comments }) => {
            likesData[id] = likes || 0;
            commentsData[id] = comments || [];
          });

          setLikes(likesData);
          setComments(commentsData);
        } else {
          console.log("Connect your Wallet");
        }
      } catch (error) {
        console.log(error);
      }
    };
    AllMyNFT();
  }, [account, MyNFT]);

  const handleLike = async (nftId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/nft/like", {
        nftId,
        user: SelectedAccount, // Pass user/account for tracking
      });
  
      setLikes((prev) => ({ ...prev, [nftId]: res.data.likes })); // Update likes state
    } catch (error) {
      console.error("Error liking NFT:", error);
    }
  };
  
  const handleAddComment = async (nftId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/nft/comment", {
        nftId,
        user: SelectedAccount, 
        text: newComment,      
      });
      setComments((prev) => ({ ...prev, [nftId]: res.data }));
      setNewComment(""); 
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      <div>{openNFTdetail && <Nftdetails imgurls={imgurl} />}</div>
      {NFTArry.length > 0 ? (
        <div style={gridContainerStyle}>
          {NFTArry.map((NFT, index) => (
            <div key={index} className="nft-card" style={cardStyle}>
              <img src={NFT} alt="Not Found" style={imageStyle} onClick={() => navigate(NFT)} />
              <div style={interactionStyle}>
                <div style={likeStyle} onClick={() => handleLike(NFT)}>
                  ❤️ {likes[NFT] }
                </div>
                <div style={commentStyle}>
                  💬 {comments[NFT]?.length || 0}
                </div>
              </div>
              <div style={commentInputStyle}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleAddComment(NFT)}>Post</button>
              </div>
              <ul style={commentListStyle}>
               {(Array.isArray(comments[NFT]) ? comments[NFT] : []).map((comment, idx) => (
               <li key={idx}>{comment.text}</li>
              ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <li>No NFTs Owned</li>
      )}
    </>
  );
}

const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  padding: '20px',
  justifyContent: 'center',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  width: '200px',
  padding: '10px',
  margin: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
  width: '100%',
  borderRadius: '10px',
};

const interactionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '10px',
};

const likeStyle = {
  cursor: 'pointer',
  color: 'red',
  fontWeight: 'bold',
};

const commentStyle = {
  cursor: 'pointer',
  color: 'blue',
  fontWeight: 'bold',
};

const commentInputStyle = {
  marginTop: '10px',
  display: 'flex',
  gap: '5px',
};

const commentListStyle = {
  marginTop: '10px',
  listStyleType: 'none',
  paddingLeft: '0',
};
