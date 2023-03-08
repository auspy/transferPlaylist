import GetPlaylistId from "../../components/GetPlaylistId";

const Home = () => {
    return (
        <div className="">
        <GetPlaylistId/>
        <GetPlaylistId type='youtube' />
      </div>
    );
}

export default Home;