import { useState } from "react";
import { useStateContext } from "../context"; 
import axios from "axios";
import toast from "react-hot-toast";

export default function Mintnft (){
  const {MintNFT} = useStateContext();
  const [file,setfile] = useState(null);
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;  
  
  
  const UploadFileToIPFS = async(file) =>{
   const loading = new Promise(async(resolve,reject) => {
    try{
      const formData = new FormData();
      formData.append("file",file);
      const config ={
        headers: {
          pinata_api_key: '454f6f7bce1504d9fa21',
          pinata_secret_api_key: '939cb4596c0335d756f00b4a0726deaefd67bd4d307c1c07950b281fa6f0f135', 
          "Content-Type": "multipart/form-data",
        }
      }
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",formData,config);
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const mintnft = await MintNFT(url);
      resolve(mintnft);
     } catch(error){
      reject(error)
     }
   });
    toast.promise(loading, {
    loading: "Uploading file...",
    success: "File uploaded successfully!",
    error: "Failed to upload file!",
   });
  };
    
  return (<>
    <input type = "file" onChange={(e) => setfile(e.target.files[0])}/><br/>
    <button onClick={()=>UploadFileToIPFS(file)}>UploadFile</button>
  </>);
}
//old secrtkeys and api = 
//454f6f7bce1504d9fa21
//939cb4596c0335d756f00b4a0726deaefd67bd4d307c1c07950b281fa6f0f135