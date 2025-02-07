import { Link } from "react-router-dom";
const Navigation = () =>{
 return(
    <div>
        <Link to="/"><button>Home</button></Link>
        <Link to="/MintNFT"><button>MintNFT</button></Link>
        <Link to="/Profile"><button>Profile</button></Link>
    </div>
   
 )
}
export default Navigation;