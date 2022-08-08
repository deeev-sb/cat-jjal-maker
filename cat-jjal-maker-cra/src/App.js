import './App.css';
import React from "react";
import Title from "./component/Title"
import Form from "./component/Form"
import MainCard from "./component/MainCard";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) { // 인자는 Object로 들어옴
  return (
    <li>
      <img src={props.img} alt={"고양이 이미지"} style={{width: "150px"}}/>
    </li>
  );
}

function Favorites({favorites}) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }

  return (
    // map을 사용하면 배열을 순회하면서 배열의 수 만큼 생성됨
    // 리스트의 모든 child는 유니크한 "key" prop이 있어야 함.
    <ul className="favorites">
      {favorites.map((cat) => (<CatItem img={cat} key={cat}/>))}
    </ul>
  );
}

const App = () => {
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter')
  }); // localStorage 는 String 값을 반환함
  const [mainCat, setMainCat] = React.useState();
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || []
  }); // 좋아요 목록, null 값이면 빈 배열 반환

  // 좋아요 목록에 포함되어 있는지 반환됨
  const alreadyFavorite = favorites.includes(mainCat);

  // 브라우저 접속 시 표시될 이미지
  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  // async&await 문법
  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function onHeartClick() {
    const nextFavorites = [...favorites, mainCat]; // mainCat이 favorites 내에 추가됨 (ES6 + Spread Operator 문법)
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  const title = counter ? <div>{counter}번째 고양이</div> : <div>고양이 짤방 실습</div>;

  return (
    <div>
      <Title>{title}</Title>
      <Form updateMainCat={updateMainCat}/>
      <MainCard img={mainCat} onHeartClick={onHeartClick} alreadyFavorite={alreadyFavorite}/>
      <Favorites favorites={favorites}/>
    </div>
  );
}

export default App;
