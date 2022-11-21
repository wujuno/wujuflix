import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IGetTvResult, ISearchMovie} from "../api"

const API_KEY = "9d27f56aff4179e9e209022baf4f7d7f";
const BASE_PATH = "https://api.themoviedb.org/3";

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
const TvSlider = styled.div`
  position: relative;
  top: 100px;
`;


const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  margin-top:20px;
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

const offset = 6;

function Search() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/search/:tvId");
  const { scrollY } = useScroll();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  function getSearchMovies() {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(
      response => response.json());
  }
  function getSearchTv() {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then(
      response => response.json());
  }
  const {data, isLoading} = useQuery<ISearchMovie>(["search", "movies"], getSearchMovies);
  const {data:tvData, isLoading:tvLoading} = useQuery<IGetTvResult>(["search", "tv"], getSearchTv);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/search/${tvId}`);
  };
  const onOverlayClick = () => history.push("/search");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
    return (
      <Wrapper>
        {isLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner
          onClick={incraseIndex}
          bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
        >
          <Title>{data?.results[0].title}</Title>
          <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        <Slider>
          <div>
          <SliderTitle>Movies</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      onClick={() => onBoxClicked(tv.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={tv.id}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{tv.title}</h4>
                       </Info>
                    </Box>
                    ))}
              </Row>
            </AnimatePresence>
          </div>
        </Slider>
        <TvSlider>
          <div>
          <SliderTitle>Tv Shows</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tvData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      onClick={() => onBoxClicked(tv.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type:"tween"}}
                      key={tv.id}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                    <Info
                      variants={infoVariants}
                       >
                        <h4>{tv.name}</h4>
                       </Info>
                    </Box>
                    ))}
              </Row>
            </AnimatePresence>
          </div>
        </TvSlider>
        <AnimatePresence>
            {bigTvMatch ? (
              <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie
                style={{ top: scrollY.get() + 100 }}
                layoutId={bigTvMatch.params.tvId}
              >
                {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.title}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
              </BigMovie>
            </>
            ) : null}
          </AnimatePresence>
        </>
    )}
      </Wrapper>
    );
  }
  export default Search;