import { useStateContext } from "../context/index";
import { useState, useEffect } from "react";

export default function Nftdetails({ imgurls }) {
  const { NFTdetail, SelectedAccount, setopenNFtdetail, transferNFt } = useStateContext();
  const [nftdeatile, setnftdeatile] = useState(null);
  const [transferto, settransferto] = useState("");
  const fetchNftDetails = async () => {
    try {
      if (imgurls) {
        const NFT = await NFTdetail(imgurls);
        setnftdeatile(NFT || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNftDetails();
  }, [imgurls]);

  return (
    <div style={overlayStyle}>
      <div style={detailCardStyle}>
        <span onClick={() => setopenNFtdetail(false)} style={closeButtonStyle}>&times;</span>
        {nftdeatile && nftdeatile.id ? (
          <>
            <h2>NFT Details</h2>
            <img src={imgurls} alt="NFT" style={imageStyle} />
            <div style={infoStyle}>
              <p><strong>ID:</strong> {nftdeatile.id}</p>
              <p><strong>Owner:</strong> {nftdeatile.owner}</p>
              <p><strong>Creator:</strong> {nftdeatile.creator}</p>
              {SelectedAccount && nftdeatile && nftdeatile.owner && 
               (SelectedAccount.toLowerCase() === nftdeatile.owner.toLowerCase() ? (
                <div>
                <input placeholder="address" type="text" value={transferto} 
                onChange={(e)=> settransferto(e.target.value)}/>
                <button onClick={() =>transferNFt(transferto,imgurls)} style={buttonStyle}>Transfer NFT</button>
                </div>
              ) : (
               <p style={warningStyle}>You are not the owner of this NFT</p>
               ))
              }
            </div>
          </>
        ) : (
          <div style={noNftStyle}>
            <p>There is no such NFT</p>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const detailCardStyle = {
  backgroundColor: '#9626a9',
  border: '1px solid #ddd',
  borderRadius: '15px',
  width: '400px',
  padding: '20px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#fff',
};

const imageStyle = {
  width: '100%',
  borderRadius: '10px',
  marginBottom: '20px',
};

const infoStyle = {
  textAlign: 'left',
  fontSize: '16px',
  lineHeight: '1.6',
};

const buttonStyle = {
  marginTop: '15px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const warningStyle = {
  color: 'white',
  fontWeight: 'bold',
};

const noNftStyle = {
  textAlign: 'center',
  padding: '20px',
};
