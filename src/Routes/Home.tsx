import { useQuery } from "@tanstack/react-query";
import { getNowPlayingMovies,getPopularMovies, getTopRatedMovies, getUpCommingMovies, IGetMoviesResult, } from "../api";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import {motion, AnimatePresence, useScroll} from "framer-motion"
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";


const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  height: 200vh
 
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
  color: ${(props) => props.theme.white.darker};

`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
  color: ${(props) => props.theme.white.darker};
`;

const Slider = styled.div`
  position: relative;
  top: -150px;

`;
const PopularSlider = styled.div`
  position: relative;
  top: 100px;
`;
const TopLatedSlider = styled.div`
  position: relative;
  top: 350px;
`;
const UpCommingSlider = styled.div`
  position: relative;
  top: 600px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-top:20px;
  position:absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  &: first-child {
    transform-origin: center left
  }
  &: last-child {
    transform-origin: center right
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding:10px;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }

;`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderTitle = styled.span`
  color:${(props) => props.theme.white.lighter};
  font-size: 25px;
  padding: 0 20px;
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween"
    }
  }
}

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const offset = 6;

const boxVariants = {
  normal: {
    scale :1,
  },
  hover: {
    scale:1.3,
    y: -15,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween"
    }
  }
};

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();
  const useMultipleQuery = () => {
    const playing = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
    const popular = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
    const topLated = useQuery<IGetMoviesResult>(["movies", "toplated"], getTopRatedMovies);
    const upComming = useQuery<IGetMoviesResult>(["movies", "upcomming"], getUpCommingMovies);
    return [playing,popular,topLated,upComming]
  }
  const [
      {data: playingData, isLoading: playingLoading },
      {data: popularData, isLoading: popularLoading },
      {data: topLatedData, isLoading: topLatedLoading },
      {data: upCommingData, isLoading: upCommingLoading },
  ] = useMultipleQuery()
  const MoviesSliderArray = [playingData,popularData,topLatedData,upCommingData]
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (playingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = playingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMoviePlay =
    bigMovieMatch?.params.movieId &&
    playingData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId)
    console.log(clickedMoviePlay);
  return (
    <Wrapper>
    {playingLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner
          onClick={incraseIndex}
          bgphoto={makeImagePath(playingData?.results[0].backdrop_path || "")}
        >
          <Title>{playingData?.results[0].title}</Title>
          <Overview>{playingData?.results[0].overview}</Overview>
        </Banner>
        <Slider>
          <div>
          <SliderTitle>Now Playing</SliderTitle>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {playingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) =>(
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{movie.title}</h4>
                       </Info>
                    </Box>
                  ))}
            </Row>
          </AnimatePresence>
          </div> 
          </Slider>
        <PopularSlider>
          <div>
          <SliderTitle>Popular</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{movie.title}</h4>
                       </Info>
                    </Box>
                    ))}
              </Row>
            </AnimatePresence>
          </div>
          </PopularSlider>
        <TopLatedSlider>
          <div>
          <SliderTitle>Top Lated</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {topLatedData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{movie.title}</h4>
                       </Info>
                    </Box>
                    ))}
              </Row>
            </AnimatePresence>
          </div>
          </TopLatedSlider>
        <UpCommingSlider>
          <div>
          <SliderTitle>Up Comming</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {upCommingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{movie.title}</h4>
                       </Info>
                    </Box>
                    ))}
              </Row>
            </AnimatePresence>
          </div>
          </UpCommingSlider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie
                style={{ top: scrollY.get() + 100 }}
                layoutId={bigMovieMatch.params.movieId}
              >
                {clickedMoviePlay && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMoviePlay.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMoviePlay.title}</BigTitle>
                      <BigOverview>{clickedMoviePlay.overview}</BigOverview>
                    </>
                  )}
               
              </BigMovie>
            </>
            ) : null}
          </AnimatePresence>
      </>
    )}
  </Wrapper>
  )
}

export default Home;