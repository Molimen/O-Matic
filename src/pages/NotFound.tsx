import { useNavigate } from "react-router-dom";
import ButtonElement from "../components/user-input/ButtonProcess";

export default function NotFound() {
  const navigate = useNavigate();

  const changePage = () =>{
    void navigate('/');
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 z-0 relative flex flex-col items-center">
        <img className="scale-80" src="/images/not-found.png" alt=""></img>

        <span className="text-7xl">
          Oh,
          <span className="font-GOODBYE-DESPAIR font-bold tracking-tighter">The Tragedy!</span>
        </span>

        <span className="text-3xl text-center mt-4">
          The page you looking either doesn't exist or the wrong address. Let's go back!
        </span>

        <div className="mt-10">
          <ButtonElement name="Go to Homepage" icon="home" onClick={changePage} />
        </div>
      </div>
    </>
  )
}